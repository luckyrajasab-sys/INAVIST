import { Notification } from "../models/Notification.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return sendSuccess(res, { notifications, unreadCount }, "Notifications fetched.");
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: { isRead: true, readAt: new Date() } },
      { new: true }
    );

    if (!notification) return sendError(res, "Notification not found.", 404, "NOT_FOUND");
    return sendSuccess(res, notification, "Notification marked as read.");
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    return sendSuccess(res, {}, "All notifications marked as read.");
  } catch (error) {
    next(error);
  }
};
