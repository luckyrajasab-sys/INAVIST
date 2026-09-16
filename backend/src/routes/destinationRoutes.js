import { Router } from "express";
import {
  getAllDestinations,
  getDestinationById,
  getDestinationsByState,
  getDestinationsByDistrict,
  searchDestinations,
  getNearbyDestinations,
  createDestination,
  updateDestination,
  deleteDestination
} from "../controllers/destinationController.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = Router();

// Public destination discovery
router.get("/", getAllDestinations);
router.get("/search", searchDestinations);
router.get("/nearby", getNearbyDestinations);
router.get("/state/:state", getDestinationsByState);
router.get("/district/:district", getDestinationsByDistrict);
router.get("/:id", getDestinationById);

// Admin destination management
router.post("/", authenticate, authorizeRoles("admin"), createDestination);
router.put("/:id", authenticate, authorizeRoles("admin"), updateDestination);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteDestination);

export default router;
