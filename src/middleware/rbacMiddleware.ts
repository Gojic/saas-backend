import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { PERMISSIONS, Role } from "../types/auth.types";

export const can = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as Role;
    if (!userRole || !PERMISSIONS[userRole]?.includes(permission)) {
      return next(
        new AppError("Forbidden: Insufficient permissions", 403, "FORBIDDEN"),
      );
    }
    next();
  };
};
