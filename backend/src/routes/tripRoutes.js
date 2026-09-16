import { Router } from "express";
import {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  shareTrip,
  modifyCrisis
} from "../controllers/tripController.js";
import { optionalAuth, authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, getAllTrips);
router.post("/", optionalAuth, createTrip);
router.post("/modify-crisis", modifyCrisis);
router.get("/:id", optionalAuth, getTripById);
router.put("/:id", optionalAuth, updateTrip);
router.delete("/:id", optionalAuth, deleteTrip);
router.post("/:id/share", optionalAuth, shareTrip);

export default router;
