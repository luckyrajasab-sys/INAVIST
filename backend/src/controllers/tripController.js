import crypto from "crypto";
import { Trip } from "../models/Trip.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { tripSchema } from "../validators/index.js";
import { modifyPlanForCrisis } from "../services/crisisEngineService.js";

export const getAllTrips = async (req, res, next) => {
  try {
    const query = req.user ? { userId: req.user._id } : { isPublic: true };
    const trips = await Trip.find(query).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, trips, "Trips retrieved.");
  } catch (error) {
    next(error);
  }
};

export const getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { shareToken: id }
      ]
    }).lean();

    if (!trip) {
      return sendError(res, `Trip not found with id: ${id}`, 404, "NOT_FOUND");
    }

    return sendSuccess(res, trip, "Trip details fetched.");
  } catch (error) {
    next(error);
  }
};

export const createTrip = async (req, res, next) => {
  try {
    const { error, value } = tripSchema.validate(req.body);
    if (error) return sendError(res, error.details[0].message, 400, "VALIDATION_ERROR");

    const trip = new Trip({
      ...value,
      userId: req.user ? req.user._id : "65e000000000000000000001",
      userEmail: req.user?.email || "traveler@yatri.com",
      shareToken: crypto.randomBytes(8).toString("hex")
    });

    await trip.save();
    return sendSuccess(res, trip, "Trip plan saved successfully.", 201);
  } catch (error) {
    next(error);
  }
};

export const updateTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);

    if (!trip) {
      return sendError(res, "Trip not found.", 404, "NOT_FOUND");
    }

    if (req.user && trip.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return sendError(res, "Unauthorized to edit this trip.", 403, "FORBIDDEN");
    }

    Object.assign(trip, req.body);
    await trip.save();

    return sendSuccess(res, trip, "Trip updated successfully.");
  } catch (error) {
    next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);

    if (!trip) {
      return sendError(res, "Trip not found.", 404, "NOT_FOUND");
    }

    if (req.user && trip.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return sendError(res, "Unauthorized to delete this trip.", 403, "FORBIDDEN");
    }

    await Trip.findByIdAndDelete(id);
    return sendSuccess(res, {}, "Trip deleted successfully.");
  } catch (error) {
    next(error);
  }
};

export const shareTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);

    if (!trip) return sendError(res, "Trip not found.", 404, "NOT_FOUND");

    trip.isPublic = true;
    if (!trip.shareToken) {
      trip.shareToken = crypto.randomBytes(8).toString("hex");
    }
    await trip.save();

    const shareUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/trip/shared/${trip.shareToken}`;
    return sendSuccess(res, { shareToken: trip.shareToken, shareUrl }, "Trip shared successfully.");
  } catch (error) {
    next(error);
  }
};

export const modifyCrisis = async (req, res, next) => {
  try {
    const { currentPlan, crisisType, customProblem } = req.body;
    const modified = modifyPlanForCrisis(currentPlan, crisisType, customProblem);
    return sendSuccess(res, modified, "Itinerary successfully adjusted for travel situation.");
  } catch (error) {
    next(error);
  }
};
