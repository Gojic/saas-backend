import { Router } from "express";
import {
  login,
  signUp,
  refresh,
  logout,
  revokeAllSessions,
} from "../controllers/auth.controller";
import { loginIdentityLimiter, loginIpLimiter } from "../middleware/rateLimit";
import { validate } from "../middleware/validators";
import {
  registerValidators,
  loginValidators,
} from "../validators/auth.validators";
import authenticate from "../middleware/is-auth";
const router = Router();

router.post("/signup", registerValidators, validate, signUp);
router.post(
  "/login",

  loginValidators,
  validate,
  loginIpLimiter,
  loginIdentityLimiter,
  login,
);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/revoke-all", authenticate, revokeAllSessions);
export default router;
