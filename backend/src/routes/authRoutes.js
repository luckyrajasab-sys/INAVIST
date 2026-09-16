import { Router } from "express";
import {
  register,
  login,
  demoLogin,
  adminLogin,
  socialLogin,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateRegisteredLocation,
  getSavedUpiIds,
  addSavedUpiId,
  removeSavedUpiId
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/demo-login", demoLogin);
router.post("/admin-login", adminLogin);
router.post("/social", socialLogin);
router.post("/refresh-token", refreshToken);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

// Registered Location & UPI routes
router.put("/location", updateRegisteredLocation);
router.get("/upi-ids", getSavedUpiIds);
router.post("/upi-ids", addSavedUpiId);
router.delete("/upi-ids/:upiId", removeSavedUpiId);

export default router;
