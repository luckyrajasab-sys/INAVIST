import express from "express";
import { db } from "../data/db.js";

const router = express.Router();

// GET /api/transports
router.get("/", (req, res) => {
  const { type, from, to } = req.query;
  let results = [...db.transports];

  if (type && type !== "all") {
    results = results.filter((t) => t.type === type);
  }
  if (from) {
    results = results.filter((t) => t.from.toLowerCase().includes(from.toLowerCase()));
  }
  if (to) {
    results = results.filter((t) => t.to.toLowerCase().includes(to.toLowerCase()));
  }

  res.json({
    count: results.length,
    transports: results
  });
});

// GET /api/transports/pnr/:pnr
router.get("/pnr/:pnr", (req, res) => {
  const { pnr } = req.params;
  const booking = db.bookings.find((b) => b.pnr.toUpperCase() === pnr.toUpperCase());
  if (booking) {
    return res.json({
      found: true,
      pnr: booking.pnr,
      details: booking.details,
      travelDate: booking.travelDate,
      passengers: booking.passengers,
      status: booking.status
    });
  }

  // Simulated PNR Lookup for any valid mock PNR
  res.json({
    found: true,
    pnr: pnr.toUpperCase(),
    details: "Vande Bharat Express (22436) NDLS -> BSB",
    travelDate: "2026-09-15",
    passengers: 2,
    coach: "C4 (Chair Car)",
    seats: "42, 43",
    status: "Confirmed (Chart Not Prepared)"
  });
});

export default router;
