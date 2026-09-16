import { Router } from "express";
import { triggerSOS, getSOSHistory, resolveSOS } from "../controllers/sosController.js";
import { optionalAuth, authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/sos", authLimiter, optionalAuth, triggerSOS);
router.get("/history", authenticate, getSOSHistory);
router.patch("/:id/resolve", authenticate, authorizeRoles("admin"), resolveSOS);

export default router;
