import express from "express";
import { db } from "../data/db.js";

const router = express.Router();

// GET /api/bookings
router.get("/", (req, res) => {
  res.json({
    count: db.bookings.length,
    bookings: db.bookings
  });
});

// POST /api/bookings
router.post("/", (req, res) => {
  const { type, title, details, travelDate, passengers, amount, paymentMethod } = req.body;

  const pnr = `YTR-${Math.floor(100000 + Math.random() * 900000)}`;
  const newBooking = {
    id: `bk-${Date.now()}`,
    pnr,
    type: type || "hotel",
    title: title || "Booking",
    details: details || "",
    travelDate: travelDate || new Date().toISOString().split("T")[0],
    passengers: passengers || 1,
    amount: amount || 0,
    paymentMethod: paymentMethod || "UPI",
    status: "Confirmed",
    bookedAt: new Date().toLocaleString()
  };

  db.bookings.unshift(newBooking);
  res.status(201).json({
    success: true,
    message: "Booking confirmed successfully",
    booking: newBooking
  });
});

// DELETE /api/bookings/:id
router.delete("/:id", (req, res) => {
  const index = db.bookings.findIndex((b) => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }
  const cancelled = db.bookings.splice(index, 1);
  res.json({ message: "Booking cancelled", booking: cancelled[0] });
});

export default router;
