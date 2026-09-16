import express from "express";
import { db } from "../data/db.js";
import { authenticateJWT, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/destinations
router.get("/", (req, res) => {
  const { state, district, category, isHiddenGem, search } = req.query;

  let results = [...db.destinations];

  if (state) {
    results = results.filter((d) => d.state.toLowerCase() === state.toLowerCase());
  }
  if (district) {
    results = results.filter((d) => d.district.toLowerCase() === district.toLowerCase());
  }
  if (category && category !== "all") {
    if (category === "hidden-gem") {
      results = results.filter((d) => d.isHiddenGem);
    } else {
      results = results.filter((d) => d.category === category);
    }
  }
  if (isHiddenGem === "true") {
    results = results.filter((d) => d.isHiddenGem);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.district.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    );
  }

  res.json({
    count: results.length,
    destinations: results
  });
});

// GET /api/destinations/:id
router.get("/:id", (req, res) => {
  const dest = db.destinations.find((d) => d.id === req.params.id);
  if (!dest) {
    return res.status(404).json({ error: "Destination not found" });
  }
  res.json(dest);
});

// POST /api/destinations (Admin only)
router.post("/", authenticateJWT, requireAdmin, (req, res) => {
  const newDest = {
    id: `dest-${Date.now()}`,
    rating: 5.0,
    reviewsCount: 1,
    ...req.body
  };
  db.destinations.unshift(newDest);
  res.status(201).json(newDest);
});

// PUT /api/destinations/:id (Admin only)
router.put("/:id", authenticateJWT, requireAdmin, (req, res) => {
  const index = db.destinations.findIndex((d) => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Destination not found" });
  }
  db.destinations[index] = { ...db.destinations[index], ...req.body };
  res.json(db.destinations[index]);
});

// DELETE /api/destinations/:id (Admin only)
router.delete("/:id", authenticateJWT, requireAdmin, (req, res) => {
  const index = db.destinations.findIndex((d) => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Destination not found" });
  }
  const deleted = db.destinations.splice(index, 1);
  res.json({ message: "Destination removed", destination: deleted[0] });
});

export default router;
