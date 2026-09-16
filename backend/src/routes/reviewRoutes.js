import { Router } from "express";
import {
  getReviews,
  createReview,
  deleteReview,
  reportReview,
  moderateReview
} from "../controllers/reviewController.js";
import { optionalAuth, authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = Router();

router.get("/", getReviews);
router.post("/", optionalAuth, createReview);
router.delete("/:id", optionalAuth, deleteReview);
router.post("/:id/report", optionalAuth, reportReview);
router.put("/:id/moderate", authenticate, authorizeRoles("admin", "moderator"), moderateReview);

export default router;
