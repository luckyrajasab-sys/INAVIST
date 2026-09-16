import { Router } from "express";
import {
  getGroups,
  getGroupById,
  createGroup,
  sendJoinRequest,
  respondToJoinRequest,
  leaveGroup,
  reportUser
} from "../controllers/companionController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", getGroups);
router.get("/:id", getGroupById);
router.post("/", authenticate, createGroup);
router.post("/:id/join", authenticate, sendJoinRequest);
router.post("/:id/requests/:reqId", authenticate, respondToJoinRequest);
router.post("/:id/leave", authenticate, leaveGroup);
router.post("/report", authenticate, reportUser);

export default router;
