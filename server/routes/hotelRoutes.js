import express from "express";
import { db } from "../data/db.js";

const router = express.Router();

// GET /api/hotels
router.get("/", (req, res) => {
  const { state, district, city, category, type, search } = req.query;
  let results = [...db.hotels];

  if (state) {
    results = results.filter((h) => h.state.toLowerCase() === state.toLowerCase());
  }
  if (district) {
    results = results.filter((h) => h.district.toLowerCase() === district.toLowerCase());
  }
  if (city) {
    results = results.filter((h) => h.city.toLowerCase().includes(city.toLowerCase()));
  }
  if (category && category !== "all") {
    results = results.filter((h) => h.category.toLowerCase() === category.toLowerCase());
  }
  if (type && type !== "all") {
    results = results.filter((h) => h.type.toLowerCase() === type.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.district.toLowerCase().includes(q) ||
        h.state.toLowerCase().includes(q)
    );
  }

  res.json({
    count: results.length,
    hotels: results
  });
});

// GET /api/hotels/:id
router.get("/:id", (req, res) => {
  const hotel = db.hotels.find((h) => h.id === req.params.id);
  if (!hotel) {
    return res.status(404).json({ error: "Hotel not found" });
  }
  res.json(hotel);
});

export default router;
