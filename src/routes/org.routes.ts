import { Router } from "express";
import authenticate from "../middleware/is-auth";
import {
  createOrg,
  getOrg,
  getMembers,
  updateOrg,
  deleteOrg,
  leaveOrg,
  removeMember,
  changeMemberRole,
  transferOwnership,
} from "../controllers/org.controller";
import { validate } from "../middleware/validators";
import { isMember } from "../middleware/isMember";
import {
  orgValidators,
  updateOrgValidators,
} from "../validators/org.validators";
const router = Router();
// --- Osnovne Org Operacije ---
router.post("/", authenticate, orgValidators, validate, createOrg);
router.get("/:orgId", authenticate, isMember, getOrg);
router.patch(
  "/:orgId",
  authenticate,
  isMember,
  updateOrgValidators,
  validate,
  updateOrg,
);
router.delete("/:orgId", authenticate, isMember, deleteOrg);

// --- Upravljanje Članovima ---
router.get("/:orgId/members", authenticate, isMember, getMembers);
router.post("/:orgId/leave", authenticate, isMember, leaveOrg);
router.delete(
  "/:orgId/members/:memberId",
  authenticate,
  isMember,
  removeMember,
);
router.patch(
  "/:orgId/members/:memberId/role",
  authenticate,
  isMember,
  changeMemberRole,
);

// --- Vlasništvo ---
router.post(
  "/:orgId/transfer-ownership",
  authenticate,
  isMember,
  transferOwnership,
);
export default router;
