/*import { Request, Response, NextFunction } from "express";
import db from "../db/db";

export const isMember = (req: Request, res: Response, next: NextFunction) => {
  const { orgId } = req.params;
  const userOrgId = req.user?.orgId;

  const parsedOrgId: number = Number(orgId);
  const parsedUserOrgId: number = Number(userOrgId);

  if (isNaN(parsedOrgId) || isNaN(parsedUserOrgId)) {
    return res.status(400).json({ message: "Invalid organization ID format" });
  }
  if (parsedOrgId !== parsedUserOrgId) {
    return res
      .status(403)
      .json({ message: "Forbidden: Not your organization" });
  }
  next();
}; */

import { Request, Response, NextFunction } from "express";
import db from "../db/db"; // Proveri putanju do tvog db objekta

export const isMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orgId = Number(req.params.orgId);
    const userId = req.user?.userId; // ID korisnika iz dekodiranog JWT-a

    // 1. Tehnička provera (da izbegneš NaN)
    if (isNaN(orgId)) {
      return res
        .status(400)
        .json({ message: "Invalid Organization ID format" });
    }

    // 2. Bezbednosna provera: Pitamo bazu da li postoji veza
    const membership = await db.OrgMember.findOne({
      where: {
        userId: userId,
        orgId: orgId,
      },
    });

    // 3. Ako red u tabeli ne postoji, korisnik stvarno nema pristup
    if (!membership) {
      console.log(`Access denied for user ${userId} to org ${orgId}`);
      return res.status(403).json({
        message: "Forbidden: You are not a member of this organization",
      });
    }

    // 4. Sve je u redu, pusti ga dalje
    next();
  } catch (error) {
    next(error);
  }
};
