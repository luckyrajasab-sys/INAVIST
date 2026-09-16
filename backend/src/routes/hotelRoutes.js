import { Router } from "express";
import { searchHotels, getHotelById, createHotel } from "../controllers/hotelController.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = Router();

router.get("/", searchHotels);
router.get("/:id", getHotelById);
router.post("/", authenticate, authorizeRoles("admin"), createHotel);

export default router;
