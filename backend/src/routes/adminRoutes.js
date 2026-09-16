import { Router } from "express";
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  getReports,
  updateReportStatus
} from "../controllers/adminController.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = Router();

router.use(authenticate, authorizeRoles("admin")); // Strictly admin-protected

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.get("/reports", getReports);
router.patch("/reports/:id", updateReportStatus);

export default router;
