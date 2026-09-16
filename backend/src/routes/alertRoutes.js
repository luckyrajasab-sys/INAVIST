import { Router } from "express";
import {
  getAlerts,
  getAlertsByDestination,
  createAlert,
  deleteAlert
} from "../controllers/alertController.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = Router();

router.get("/", getAlerts);
router.get("/destination/:destId", getAlertsByDestination);
router.post("/", authenticate, authorizeRoles("admin", "moderator"), createAlert);
router.delete("/:id", authenticate, authorizeRoles("admin", "moderator"), deleteAlert);

export default router;
