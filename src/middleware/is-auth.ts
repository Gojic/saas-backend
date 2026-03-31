import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { JwtPayload } from "../types/auth.types";
import { tenantContext } from "../utils/tenantContext";

export default function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return next(new AppError("Not authenticated (no token).", 401, "NO_TOKEN"));
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return next(
      new AppError("Bad Authorization header format.", 401, "BAD_HEADER"),
    );
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return next(
      new AppError(
        "JWT secret is not defined on server.",
        500,
        "MISSING_SECRET",
      ),
    );
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = decoded;

    return tenantContext.run(decoded.orgId, () => {
      next();
    });
  } catch (err: unknown) {
    const name =
      typeof err === "object" && err && "name" in err
        ? (err as any).name
        : "Unknown";

    if (name === "TokenExpiredError") {
      return next(new AppError("Token has expired.", 401, "TOKEN_EXPIRED"));
    }
    return next(
      new AppError("Not authenticated (invalid token).", 401, "INVALID_TOKEN"),
    );
  }
}
