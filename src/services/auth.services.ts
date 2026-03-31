import db from "../db/db";
import { UserDTO, CreateUserInputDTO, UserEntity } from "../types/auth.types";
import { WhereOptions } from "sequelize";
import * as orgService from "./org.service";
export async function findFullUser(
  where: WhereOptions,
  orgId?: number,
): Promise<UserEntity | null> {
  // Koristi db.User koji je već tu, samo ga kastuj u ModelStatic ako treba
  const model = orgId ? db.User.scope({ method: ["tenant", orgId] }) : db.User;

  // Ovde koristi model.findOne...
  const user = await model.findOne({
    where,
    include: [{ model: db.OrgMember, as: "memberships" }],
  });

  return user ? (user.get({ plain: true }) as UserEntity) : null;
}

export async function getUserByEmail(
  email: string,
): Promise<UserEntity | null> {
  return findFullUser({ email });
}

export async function getUserById(userId: number): Promise<UserEntity | null> {
  return findFullUser({ id: userId });
}
export async function getUserForAuth(
  email: string,
): Promise<UserEntity | null> {
  const user = await db.User.findOne({ where: { email } });
  if (!user) return null;
  return user.get({ plain: true }) as UserEntity;
}

export async function incrementTokenVersion(userId: number): Promise<void> {
  const newVersion = Date.now();
  await db.User.update({ tokenVersion: newVersion } as unknown as object, {
    where: { id: userId },
  });
}

export async function getUserWithMembership(
  email: string,
): Promise<UserEntity | null> {
  const user = await db.User.findOne({
    where: { email },
    include: [
      {
        model: db.OrgMember,
        as: "memberships",
      },
    ],
  });
  if (!user) return null;

  return user.get({ plain: true }) as UserEntity;
}

export async function createUser(data: CreateUserInputDTO): Promise<UserDTO> {
  return await db.sequelize.transaction(async (t: any) => {
    const user = await db.User.create(data, { transaction: t });

    const orgName = `${user.email.split("@")[0]}'s Workspace`;

    const org = await orgService.createOrg({
      userId: user.id,
      name: orgName,
      seatsAllowed: 1,
      transaction: t,
    });
    const membership = await db.OrgMember.findOne({
      where: { userId: user.id, orgId: org.id },
      transaction: t,
    });
    const userWithMembership = {
      ...user.get({ plain: true }),
      memberships: [membership!.get({ plain: true })],
    };

    return mapUserToDTO(userWithMembership as UserEntity);
  });
}

export function mapUserToDTO(user: UserEntity): UserDTO {
  const membership = user.memberships?.[0];
  return {
    id: user.id,
    email: user.email,
    orgId: membership ? membership.orgId : 0,
    role: membership ? membership.role : "MEMBER",
    tokenVersion: user.tokenVersion,
  };
}
