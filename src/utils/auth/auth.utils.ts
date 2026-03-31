import { JwtPayload as JwtBasePayload } from "jsonwebtoken";
import { RefreshTokenPayload } from "../../types/auth.types";

export function isRefreshTokenPayload(
  payload: string | JwtBasePayload,
): payload is RefreshTokenPayload {
  if (typeof payload === "string") return false;

  const hasUserId = "userId" in payload;
  const hasTokenVersion = "tokenVersion" in payload;

  if (!hasUserId || !hasTokenVersion) return false;

  const isUserIdValid =
    typeof payload.userId === "number" || typeof payload.userId === "string";
  const isTokenVersionValid = typeof payload.tokenVersion === "number";

  return isUserIdValid && isTokenVersionValid;
}
