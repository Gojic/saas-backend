import db from "../db/db";
import { OrgEntity, OrgDTO, OrgRole } from "../types/org.types";
import { Transaction } from "sequelize";
import {
  CreateOrgParams,
  OrgMemberDTO,
  UpdateOrgDTO,
} from "../types/org.types";
import { AppError } from "../utils/AppError";

async function findOrgById(id: number): Promise<OrgEntity | null> {
  const org = await db.Org.findByPk(id);
  return org ? (org.get({ plain: true }) as OrgEntity) : null;
}

async function getOrgById(id: number): Promise<OrgDTO | null> {
  const org = await findOrgById(id);
  return org ? mapOrgToDTO(org) : null;
}

export async function createOrg({
  userId,
  name,
  seatsAllowed,
  transaction,
}: CreateOrgParams): Promise<OrgDTO> {
  const execute = async (t: Transaction) => {
    const org = await db.Org.create(
      { name, plan: "free", seatsAllowed },
      { transaction: t },
    );

    await db.OrgMember.create(
      { userId, orgId: org.id!, role: "OWNER" },
      { transaction: t },
    );

    return mapOrgToDTO(org.get({ plain: true }) as OrgEntity);
  };

  if (transaction) {
    return await execute(transaction);
  }

  return await db.sequelize.transaction(async (t: Transaction) => {
    return await execute(t);
  });
}

export async function getOrgByIdForUser(
  orgId: number,
  userId: number,
): Promise<OrgDTO | null> {
  const member = await db.OrgMember.findOne({ where: { orgId, userId } });

  if (!member) return null;

  return getOrgById(orgId);
}

export function mapOrgToDTO(org: OrgEntity): OrgDTO {
  return {
    id: org.id,
    name: org.name,
    plan: org.plan,
  };
}

export function mapMemberToDTO(member: any): OrgMemberDTO {
  return {
    userId: member.userId,
    orgId: member.orgId,
    role: member.role,
    user: member.user
      ? {
          id: member.user.id,
          email: member.user.email,
        }
      : undefined,
  };
}

export async function getOrgMembers(orgId: number): Promise<OrgMemberDTO[]> {
  const members = await db.OrgMember.findAll({
    where: { orgId },
    include: [
      {
        model: db.User,
        as: "user",
        attributes: ["id", "email"],
      },
    ],
  });

  return members.map((m) => mapMemberToDTO(m.get({ plain: true })));
}

export async function updateOrgForUser(
  orgId: number,
  data: UpdateOrgDTO,
): Promise<OrgDTO> {
  const org = await db.Org.findByPk(orgId);

  if (!org) throw new AppError("Organization not found", 400);

  // Cast-ujemo data u 'any' samo na ovom mestu jer su modeli u JS-u,
  // ali je tvoj ulazni parametar 'data' i dalje strogo tipiziran kao UpdateOrgDTO
  await org.update(data as any);

  return mapOrgToDTO(org.get({ plain: true }) as OrgEntity);
}

export async function deleteOrgForUser(
  orgId: number,
  userId: number,
): Promise<void> {
  // 1. Provera prava pristupa - samo OWNER sme da briše
  const membership = await db.OrgMember.findOne({
    where: { orgId, userId, role: "OWNER" },
  });

  if (!membership) {
    throw new AppError(
      "Only the organization OWNER can delete the organization.",
      403,
    );
  }

  // 2. Izvršavanje brisanja u transakciji
  await db.sequelize.transaction(async (t: Transaction) => {
    // Prvo brišemo članstva (neki DB-ovi zahtevaju ovo ako nema Cascade)
    await db.Project.destroy({ where: { orgId }, transaction: t });
    await db.Documents.destroy({ where: { orgId }, transaction: t });
    await db.OrgMember.destroy({ where: { orgId }, transaction: t });
    await db.Invite.destroy({ where: { orgId }, transaction: t });

    // Na kraju samu organizaciju
    await db.Org.destroy({ where: { id: orgId }, transaction: t });
  });
}
// 1. Transfer Ownership - Najosetljivija operacija
export async function transferOrgOwnership(
  orgId: number,
  currentOwner: number,
  newOwnerId: number,
): Promise<void> {
  await db.sequelize.transaction(async (t: Transaction) => {
    // Proveri da li je trenutni korisnik OWNER

    const owner = await db.OrgMember.findOne({
      where: { orgId, userId: currentOwner, role: "OWNER" },
    });
    if (!owner)
      throw new AppError("Only the current OWNER can transfer ownership.", 401);

    // Proveri da li novi vlasnik uopšte pripada toj organizaciji
    const newOwnerMembership = await db.OrgMember.findOne({
      where: { orgId, userId: newOwnerId },
      transaction: t,
    });

    if (!newOwnerMembership)
      throw new AppError(
        "New owner must be a member of the organization.",
        401,
      );
    // Smeni trenutnog vlasnika na ADMIN (ili drugu rolu)
    await owner.update({ role: "ADMIN" }, { transaction: t });
    // Postavi novog OWNER-a
    await newOwnerMembership.update({ role: "OWNER" }, { transaction: t });
  });
}
// 2. Leave Organization
export async function leaveOrg(orgId: number, userId: number): Promise<void> {
  const membership = await db.OrgMember.findOne({ where: { orgId, userId } });
  if (!membership)
    throw new AppError("You are not a member of this organization.", 400);
  // Vlasnik ne sme da napusti organizaciju dok ne prebaci vlasništvo
  if (membership.role === "OWNER") {
    throw new AppError(
      "OWNER cannot leave without transferring ownership first.",
      400,
    );
  }
  await membership.destroy();
}

// 3. Remove Member (Izbacivanje kolege)
export async function removeOrgMember(
  orgId: number,
  adminId: number,
  memberId: number,
): Promise<void> {
  // Proveri da li je onaj koji izbacuje ADMIN ili OWNER
  const requester = await db.OrgMember.findOne({
    where: { orgId, userId: adminId },
  });
  if (
    !requester ||
    (requester.role !== "OWNER" && requester.role !== "ADMIN")
  ) {
    throw new AppError("Insufficient permissions to remove members.", 400);
  }
  const targetMember = await db.OrgMember.findOne({
    where: { orgId, userId: memberId },
  });
  if (!targetMember)
    throw new AppError("Member not found in this organization.", 400);
  // ADMIN ne sme da izbaci OWNER-a
  if (targetMember.role === "OWNER")
    throw new AppError("Cannot remove the organization OWNER.", 400);

  await targetMember.destroy();
}
export async function changeMemberRole(
  orgId: number,
  adminId: number,
  memberId: number,
  newRole: OrgRole,
): Promise<void> {
  const requester = await db.OrgMember.findOne({
    where: { orgId, userId: adminId },
  });
  if (!requester || requester.role !== "OWNER") {
    throw new AppError("Only the OWNER can change roles.", 400);
  }
  const targetMember = await db.OrgMember.findOne({
    where: { orgId, userId: memberId },
  });
  if (!targetMember) throw new AppError("Member not found.", 400);

  // Ne možeš sebi (vlasniku) da menjaš rolu ovde, za to služi transferOwnership
  if (targetMember.role === "OWNER")
    throw new Error("Use transferOwnership to change OWNER role.");

  await targetMember.update({ role: newRole });
}
