import express from "express";
import { db } from "../data/db.js";

const router = express.Router();

// GET /api/weather?location=Ladakh
router.get("/", (req, res) => {
  const { location } = req.query;

  // Realistic seasonal weather generator for Indian travel sectors
  const loc = (location || "Delhi").toLowerCase();
  let temp = 24;
  let condition = "Sunny & Clear";
  let rainProb = 10;
  let humidity = 45;
  let windSpeed = "12 km/h";

  if (loc.includes("ladakh") || loc.includes("leh") || loc.includes("spiti")) {
    temp = 14;
    condition = "Clear High-Altitude Skies";
    rainProb = 5;
    humidity = 20;
    windSpeed = "22 km/h";
  } else if (loc.includes("munnar") || loc.includes("kerala") || loc.includes("meghalaya")) {
    temp = 21;
    condition = "Misty Rain Showers";
    rainProb = 65;
    humidity = 82;
    windSpeed = "15 km/h";
  } else if (loc.includes("jaipur") || loc.includes("rajasthan") || loc.includes("jaisalmer")) {
    temp = 31;
    condition = "Bright & Sunny";
    rainProb = 2;
    humidity = 30;
    windSpeed = "10 km/h";
  }

  res.json({
    location: location || "All India",
    temperature: temp,
    condition,
    rainProbability: rainProb,
    humidity,
    windSpeed,
    forecast: [
      { day: "Tomorrow", temp: temp + 1, condition: condition, rainProb: rainProb },
      { day: "Day after", temp: temp - 1, condition: condition, rainProb: Math.max(0, rainProb - 5) },
      { day: "In 3 days", temp: temp, condition: "Sunny", rainProb: 5 }
    ],
    alerts: db.alerts.filter((a) => a.destination.toLowerCase().includes(loc) || a.isLive)
  });
});

export default router;
