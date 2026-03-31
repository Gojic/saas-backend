import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHendler";
import * as orgService from "../services/org.service";
import { CreateOrgDTO, OrgRole } from "../types/org.types";
import { AppError } from "../utils/AppError";
export const createOrg = asyncHandler(async (req: Request, res: Response) => {
  const { name, seatsAllowed } = req.body as CreateOrgDTO;

  const userId = req.user!.userId;
  const newOrg = await orgService.createOrg({
    userId,
    name,
    seatsAllowed,
  });

  return res.status(201).json({
    message: "Organization created",
    org: newOrg,
  });
});

export const getOrg = asyncHandler(async (req: Request, res: Response) => {
  const orgId = Number(req.params.orgId);
  const userId = req.user!.userId;

  const org = await orgService.getOrgByIdForUser(orgId, userId);

  if (!org) {
    throw new AppError("Organization not found or access denied", 403);
  }
  return res.status(200).json(org);
});

export const getMembers = asyncHandler(async (req: Request, res: Response) => {
  const orgId = Number(req.params.orgId);

  const members = await orgService.getOrgMembers(orgId);

  return res.status(200).json(members);
});

export const updateOrg = asyncHandler(async (req: Request, res: Response) => {
  const orgId = Number(req.params.orgId);
  const data = req.body;
  console.log("data", data);
  const updatedOrg = await orgService.updateOrgForUser(orgId, data);

  return res.status(200).json(updatedOrg);
});

export const deleteOrg = asyncHandler(async (req: Request, res: Response) => {
  const orgId = Number(req.params.orgId);
  const userId = req.user!.userId;
  await orgService.deleteOrgForUser(orgId, userId);

  return res.status(204).send();
});

export const transferOwnership = asyncHandler(
  async (req: Request, res: Response) => {
    const orgId = Number(req.params.orgId);
    const userId = req.user!.userId;
    const { newOwnerId } = req.body as { newOwnerId: number };
    await orgService.transferOrgOwnership(orgId, userId, newOwnerId);

    return res.status(200).json({ message: "Ownership transferred" });
  },
);

export const leaveOrg = asyncHandler(async (req: Request, res: Response) => {
  const orgId = Number(req.params.orgId);
  const userId = req.user!.userId;
  await orgService.leaveOrg(orgId, userId);

  return res.status(200).json({ message: "Left organization" });
});

export const removeMember = asyncHandler(
  async (req: Request, res: Response) => {
    const orgId = Number(req.params.orgId);
    const userId = req.user!.userId;
    const memberId = Number(req.params.memberId);
    await orgService.removeOrgMember(orgId, userId, memberId);

    return res.status(200).json({ message: "Member removed" });
  },
);

export const changeMemberRole = asyncHandler(
  async (req: Request, res: Response) => {
    const orgId = Number(req.params.orgId);
    const userId = req.user!.userId;
    const memberId = Number(req.params.memberId);
    const { newRole } = req.body as { newRole: OrgRole };
    await orgService.changeMemberRole(orgId, userId, memberId, newRole);
    return res.status(200).json({ message: "Member role updated" });
  },
);
