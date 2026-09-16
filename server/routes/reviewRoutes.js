import express from "express";
import { db } from "../data/db.js";
import { authenticateJWT, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/reviews?destinationId=xxx
router.get("/", (req, res) => {
  const { destinationId } = req.query;
  let list = db.reviews.filter((r) => r.status === "approved");
  if (destinationId) {
    list = list.filter((r) => r.destinationId === destinationId);
  }
  res.json({
    count: list.length,
    reviews: list
  });
});

// POST /api/reviews
router.post("/", (req, res) => {
  const { destinationId, userName, rating, ratings, comment, travelTips } = req.body;

  if (!destinationId || !comment) {
    return res.status(400).json({ error: "Destination and comment are required" });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    destinationId,
    userName: userName || "Traveler",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
    rating: Number(rating) || 5.0,
    ratings: ratings || {
      experience: 5,
      cleanliness: 5,
      safety: 5,
      accessibility: 4.8,
      valueForMoney: 5
    },
    comment,
    travelTips: travelTips || "",
    createdAt: new Date().toISOString().split("T")[0],
    status: "approved"
  };

  db.reviews.unshift(newReview);
  res.status(201).json(newReview);
});

// PUT /api/reviews/:id/moderate (Admin only)
router.put("/:id/moderate", authenticateJWT, requireAdmin, (req, res) => {
  const { status } = req.body; // 'approved' | 'rejected'
  const review = db.reviews.find((r) => r.id === req.params.id);
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }
  review.status = status;
  res.json({ message: "Review status updated", review });
});

export default router;
