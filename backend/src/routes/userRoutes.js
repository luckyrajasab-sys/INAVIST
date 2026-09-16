import { Router } from "express";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
  manageEmergencyContacts,
  managePreferences,
  toggleFavoriteDestination,
  getSavedDestinations,
  deleteAccount
} from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.use(authenticate); // All user profile endpoints require auth

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/avatar", upload.single("avatar"), uploadAvatar);
router.put("/change-password", changePassword);
router.put("/emergency-contacts", manageEmergencyContacts);
router.put("/preferences", managePreferences);
router.post("/favorites/:destinationId", toggleFavoriteDestination);
router.get("/favorites", getSavedDestinations);
router.delete("/account", deleteAccount);

export default router;
