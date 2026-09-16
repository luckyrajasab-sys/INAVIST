import { Router } from "express";
import { universalSearch, searchTravelRoutes, getLocationSuggestions } from "../controllers/searchController.js";

const router = Router();

// Universal quick search
router.get("/", universalSearch);

// Location autocomplete
router.get("/locations", getLocationSuggestions);

// Advanced Multi-Transport Route Search
router.post("/routes", searchTravelRoutes);

export default router;
