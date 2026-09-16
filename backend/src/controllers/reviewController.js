import { Review } from "../models/Review.js";
import { Destination } from "../models/Destination.js";
import { Report } from "../models/Report.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { reviewSchema } from "../validators/index.js";

const recalculateDestinationRating = async (destinationId) => {
  try {
    const reviews = await Review.find({ destinationId, status: "approved" });
    if (reviews.length === 0) return;

    const avg = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
    await Destination.findOneAndUpdate(
      { $or: [{ id: destinationId }, { _id: destinationId.match(/^[0-9a-fA-F]{24}$/) ? destinationId : null }] },
      {
        $set: {
          rating: Number(avg.toFixed(1)),
          reviewsCount: reviews.length
        }
      }
    );
  } catch (err) {
    console.error("Error recalculating destination rating:", err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const { destinationId, limit = 50 } = req.query;
    const query = { status: "approved" };

    if (destinationId) {
      query.destinationId = destinationId;
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 }).limit(Number(limit)).lean();
    return sendSuccess(res, reviews, "Reviews retrieved.");
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { error, value } = reviewSchema.validate(req.body);
    if (error) return sendError(res, error.details[0].message, 400, "VALIDATION_ERROR");

    const user = req.user || {
      _id: null,
      name: req.body.userName || "Verified Traveler",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"
    };

    const review = new Review({
      ...value,
      userId: user._id,
      userName: user.name,
      userAvatar: user.avatar,
      status: "approved"
    });

    await review.save();
    await recalculateDestinationRating(value.destinationId);

    return sendSuccess(res, review, "Review published successfully.", 201);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) return sendError(res, "Review not found.", 404, "NOT_FOUND");

    if (req.user && review.userId && review.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return sendError(res, "Unauthorized to delete this review.", 403, "FORBIDDEN");
    }

    const destId = review.destinationId;
    await Review.findByIdAndDelete(id);
    await recalculateDestinationRating(destId);

    return sendSuccess(res, {}, "Review deleted.");
  } catch (error) {
    next(error);
  }
};

export const reportReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason, details } = req.body;

    await Review.findByIdAndUpdate(id, { $inc: { reportsCount: 1 } });
    const report = new Report({
      reporterId: req.user?._id || "65e000000000000000000001",
      targetType: "review",
      targetId: id,
      reason: reason || "Inappropriate / fake review",
      details
    });

    await report.save();
    return sendSuccess(res, {}, "Review reported for moderation.");
  } catch (error) {
    next(error);
  }
};

export const moderateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
    if (!review) return sendError(res, "Review not found.", 404, "NOT_FOUND");

    await recalculateDestinationRating(review.destinationId);
    return sendSuccess(res, review, `Review status updated to '${status}'.`);
  } catch (error) {
    next(error);
  }
};
