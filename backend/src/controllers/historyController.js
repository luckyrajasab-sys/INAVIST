import { TravelHistory } from "../models/TravelHistory.js";
import { Destination } from "../models/Destination.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getHistory = async (req, res, next) => {
  try {
    const history = await TravelHistory.find({ userId: req.user._id }).sort({ updatedAt: -1 }).lean();
    return sendSuccess(res, history, "Travel history records retrieved.");
  } catch (error) {
    next(error);
  }
};

export const addOrUpdateHistory = async (req, res, next) => {
  try {
    const { destinationId, status = "visited", visitDate, rating, notes, photos, memories } = req.body;

    if (!destinationId) {
      return sendError(res, "destinationId is required.", 400, "MISSING_DESTINATION_ID");
    }

    const dest = await Destination.findOne({
      $or: [{ id: destinationId }, { _id: destinationId.match(/^[0-9a-fA-F]{24}$/) ? destinationId : null }]
    }).lean();

    const record = await TravelHistory.findOneAndUpdate(
      { userId: req.user._id, destinationId },
      {
        $set: {
          destinationName: dest?.name || destinationId,
          state: dest?.state || "",
          status,
          visitDate: visitDate || new Date().toISOString().split("T")[0],
          rating: rating || 5,
          notes: notes || "",
          photos: photos || [],
          memories: memories || []
        }
      },
      { upsert: true, new: true }
    );

    return sendSuccess(res, record, "Travel passport record saved.");
  } catch (error) {
    next(error);
  }
};

export const deleteHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await TravelHistory.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    return sendSuccess(res, {}, "Travel history record removed.");
  } catch (error) {
    next(error);
  }
};
