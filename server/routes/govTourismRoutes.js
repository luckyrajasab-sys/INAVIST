import express from "express";
import { db } from "../data/db.js";

const router = express.Router();

// GET /api/gov-tourism
router.get("/", (req, res) => {
  res.json({
    count: db.govTourism.length,
    schemes: db.govTourism,
    travelAlerts: db.alerts
  });
});

export default router;
