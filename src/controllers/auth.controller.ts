import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHendler";
import { AppError } from "../utils/AppError";
import * as users from "../services/auth.services";
import { isRefreshTokenPayload } from "./../utils/auth/auth.utils";
import {
  CreateUserInputDTO,
  LoginDTO,
  JwtPayload,
  RefreshTokenPayload,
} from "../types/auth.types";

export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const { email, passwordHash } = req.body as CreateUserInputDTO;
  console.log("email iz kontolera:", email);
  const exists = await users.getUserByEmail(email);
  if (exists) throw new AppError("User already exists", 409, "USER_EXISTS");
  const hashedPassword = await bcrypt.hash(passwordHash, 10);
  const newUser = await users.createUser({
    email,
    passwordHash: hashedPassword,
  });
  return res.status(201).json({
    message: "User created",
    user: newUser,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginDTO;

  const user = await users.getUserWithMembership(email);
  if (!user) throw new AppError("User not found", 401, "USER_NOT_FOUND");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok)
    throw new AppError("Invalid Credentials", 401, "INVALID_CREDENTIALS");
  const primaryOrg = user?.memberships?.[0];
  if (!primaryOrg) {
    throw new AppError(
      "User is not a member of any organization",
      403,
      "NO_ORG_ASSIGNED",
    );
  }
  const payload: JwtPayload = {
    userId: user!.id,
    orgId: primaryOrg.orgId,
    role: primaryOrg.role,
  };

  const jwtSecret = process.env.JWT_SECRET!;

  const accessToken = jwt.sign(payload, jwtSecret, {
    expiresIn: "15m",
  });

  const refreshPayload: RefreshTokenPayload = {
    userId: user.id,
    tokenVersion: user.tokenVersion,
  };

  const refreshToken = jwt.sign(
    refreshPayload,
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // ako je na lajvu onda ide true
    sameSite: "strict",
    path: "/api/auth/refresh",
  });
  return res.status(200).json({
    message: "Logged in",
    accessToken,
    user: users.mapUserToDTO(user),
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new AppError("No refresh token", 401);

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);

  if (!isRefreshTokenPayload(decoded)) {
    throw new AppError("Invalid token payload", 401);
  }
  // const numericUserId = Number(decoded.userId);
  const user = await users.getUserById(decoded.userId);

  if (!user) throw new AppError("User not found", 401);

  if (user.tokenVersion !== decoded.tokenVersion) {
    throw new AppError("Token revoked", 401);
  }

  const membership = user.memberships?.[0];
  if (!membership) throw new AppError("No org", 403);

  const accessTokenPayload: JwtPayload = {
    userId: user.id,
    orgId: membership.orgId,
    role: membership.role,
  };
  const newAccessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
  return res.json({ accessToken: newAccessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    path: "/api/auth/refresh",
  });

  return res.status(200).json({ message: "Logged out" });
});

export const revokeAllSessions = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }
    const userId = req.user.userId;
    await users.incrementTokenVersion(userId);
    return res.status(200).json({
      message: "All sessions have been revoked. Please log in again.",
    });
  },
);
