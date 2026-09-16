import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Destination } from "../models/Destination.js";
import { TravelHistory } from "../models/TravelHistory.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { updateProfileSchema } from "../validators/index.js";
import { processUploadedFile } from "../services/uploadService.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash -refreshTokens");
    return sendSuccess(res, { user }, "User profile retrieved.");
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) return sendError(res, error.details[0].message, 400, "VALIDATION_ERROR");

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: value },
      { new: true, runValidators: true }
    ).select("-passwordHash -refreshTokens");

    return sendSuccess(res, { user: updatedUser }, "Profile updated successfully.");
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, "Please attach an image file.", 400, "FILE_MISSING");
    }

    const avatarUrl = await processUploadedFile(req.file, req);
    req.user.avatar = avatarUrl;
    await req.user.save();

    return sendSuccess(res, { avatar: avatarUrl }, "Profile image uploaded successfully.");
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return sendError(res, "Both current and new passwords are required.", 400, "MISSING_FIELDS");
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, "Current password does not match.", 400, "INVALID_CURRENT_PASSWORD");
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    return sendSuccess(res, {}, "Password changed successfully.");
  } catch (error) {
    next(error);
  }
};

export const manageEmergencyContacts = async (req, res, next) => {
  try {
    const { emergencyContacts } = req.body;
    if (!Array.isArray(emergencyContacts)) {
      return sendError(res, "emergencyContacts must be an array.", 400, "INVALID_FORMAT");
    }

    req.user.emergencyContacts = emergencyContacts;
    await req.user.save();

    return sendSuccess(res, { emergencyContacts: req.user.emergencyContacts }, "Emergency contacts updated.");
  } catch (error) {
    next(error);
  }
};

export const managePreferences = async (req, res, next) => {
  try {
    const { travelPreferences } = req.body;
    req.user.travelPreferences = { ...req.user.travelPreferences, ...travelPreferences };
    await req.user.save();

    return sendSuccess(res, { travelPreferences: req.user.travelPreferences }, "Preferences saved.");
  } catch (error) {
    next(error);
  }
};

export const toggleFavoriteDestination = async (req, res, next) => {
  try {
    const { destinationId } = req.params;
    const user = await User.findById(req.user._id);

    const isFav = user.favoritePlaces.includes(destinationId);
    if (isFav) {
      user.favoritePlaces = user.favoritePlaces.filter((id) => id !== destinationId);
    } else {
      user.favoritePlaces.push(destinationId);
    }
    await user.save();

    return sendSuccess(res, {
      favoritePlaces: user.favoritePlaces,
      isFavorite: !isFav
    }, isFav ? "Removed from favorites." : "Added to favorites.");
  } catch (error) {
    next(error);
  }
};

export const getSavedDestinations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const destinations = await Destination.find({
      $or: [
        { id: { $in: user.favoritePlaces } },
        { _id: { $in: user.savedDestinations } }
      ]
    }).lean();

    return sendSuccess(res, { destinations }, "Saved destinations retrieved.");
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    return sendSuccess(res, {}, "Account deactivated successfully.");
  } catch (error) {
    next(error);
  }
};
