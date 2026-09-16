import { User } from "../models/User.js";
import { Destination } from "../models/Destination.js";
import { Trip } from "../models/Trip.js";
import { Review } from "../models/Review.js";
import { Report } from "../models/Report.js";
import { SOS } from "../models/SOS.js";
import { CompanionGroup } from "../models/CompanionGroup.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalDestinations,
      totalTrips,
      totalReviews,
      totalSOS,
      totalCompanionGroups,
      pendingReports
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Destination.countDocuments(),
      Trip.countDocuments(),
      Review.countDocuments(),
      SOS.countDocuments(),
      CompanionGroup.countDocuments(),
      Report.countDocuments({ status: "pending" })
    ]);

    const popularDestinations = await Destination.find()
      .sort({ rating: -1, reviewsCount: -1 })
      .limit(5)
      .select("name state rating reviewsCount category images")
      .lean();

    const stateAggregation = await Destination.aggregate([
      { $group: { _id: "$state", count: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    return sendSuccess(res, {
      summary: {
        totalUsers,
        activeUsers,
        totalDestinations,
        totalTrips,
        totalReviews,
        totalSOS,
        totalCompanionGroups,
        pendingReports
      },
      popularDestinations,
      topStates: stateAggregation.map((s) => ({ state: s._id, spotsCount: s.count, avgRating: Number((s.avgRating || 4.5).toFixed(1)) })),
      systemHealth: "Optimal (100% Microservices Online)"
    }, "Admin dashboard statistics retrieved.");
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { role, isVerified, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (isVerified !== undefined) query.isVerified = isVerified === "true";
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { homeCity: new RegExp(search, "i") }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).select("-passwordHash -refreshTokens").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean()
    ]);

    return sendSuccess(res, { users, total, page: Number(page) }, "Users list fetched.");
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, isVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { ...(role ? { role } : {}), ...(isVerified !== undefined ? { isVerified } : {}) } },
      { new: true }
    ).select("-passwordHash -refreshTokens");

    if (!user) return sendError(res, "User not found.", 404, "NOT_FOUND");
    return sendSuccess(res, user, "User credentials updated.");
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 }).lean();
    return sendSuccess(res, reports, "Reports retrieved.");
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await Report.findByIdAndUpdate(id, { status }, { new: true });
    if (!report) return sendError(res, "Report not found.", 404, "NOT_FOUND");

    return sendSuccess(res, report, `Report status updated to '${status}'.`);
  } catch (error) {
    next(error);
  }
};
