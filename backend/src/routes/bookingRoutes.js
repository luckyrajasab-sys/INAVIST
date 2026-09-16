import { Router } from "express";
import { getBookings, getBookingById, createBooking, cancelBooking } from "../controllers/bookingController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, getBookings);
router.get("/:id", optionalAuth, getBookingById);
router.post("/", optionalAuth, createBooking);
router.delete("/:id", optionalAuth, cancelBooking);

export default router;
