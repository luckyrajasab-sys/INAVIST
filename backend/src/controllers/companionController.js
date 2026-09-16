import { CompanionGroup } from "../models/CompanionGroup.js";
import { Report } from "../models/Report.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { companionGroupSchema } from "../validators/index.js";

export const getGroups = async (req, res, next) => {
  try {
    const { destination, search, limit = 30 } = req.query;
    const query = { status: "open" };

    if (destination) {
      query.destination = new RegExp(destination, "i");
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { destination: new RegExp(search, "i") },
        { interests: { $in: [new RegExp(search, "i")] } },
        { creatorName: new RegExp(search, "i") }
      ];
    }

    const groups = await CompanionGroup.find(query).sort({ createdAt: -1 }).limit(Number(limit)).lean();
    return sendSuccess(res, groups, "Travel companion groups retrieved.");
  } catch (error) {
    next(error);
  }
};

export const getGroupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const group = await CompanionGroup.findById(id).lean();

    if (!group) {
      return sendError(res, "Companion group not found.", 404, "NOT_FOUND");
    }

    return sendSuccess(res, group, "Travel group details fetched.");
  } catch (error) {
    next(error);
  }
};

export const createGroup = async (req, res, next) => {
  try {
    const { error, value } = companionGroupSchema.validate(req.body);
    if (error) return sendError(res, error.details[0].message, 400, "VALIDATION_ERROR");

    const group = new CompanionGroup({
      ...value,
      creatorId: req.user._id,
      creatorName: req.user.name,
      creatorAvatar: req.user.avatar,
      members: [
        {
          userId: req.user._id,
          name: req.user.name,
          avatar: req.user.avatar,
          role: "leader",
          joinedAt: new Date()
        }
      ]
    });

    await group.save();
    return sendSuccess(res, group, "Travel companion group created successfully.", 201);
  } catch (error) {
    next(error);
  }
};

export const sendJoinRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const group = await CompanionGroup.findById(id);
    if (!group) return sendError(res, "Group not found.", 404, "NOT_FOUND");

    const isMember = group.members.some((m) => m.userId.toString() === req.user._id.toString());
    if (isMember) {
      return sendError(res, "You are already a member of this group.", 400, "ALREADY_MEMBER");
    }

    const hasRequested = group.joinRequests.some((r) => r.userId.toString() === req.user._id.toString() && r.status === "pending");
    if (hasRequested) {
      return sendError(res, "Join request already sent.", 400, "REQUEST_EXISTS");
    }

    group.joinRequests.push({
      userId: req.user._id,
      name: req.user.name,
      avatar: req.user.avatar,
      message: message || "Would love to join your travel group!",
      status: "pending"
    });

    await group.save();
    return sendSuccess(res, group, "Join request submitted to group leader.");
  } catch (error) {
    next(error);
  }
};

export const respondToJoinRequest = async (req, res, next) => {
  try {
    const { id, reqId } = req.params;
    const { status } = req.body; // 'accepted' | 'rejected'

    if (!["accepted", "rejected"].includes(status)) {
      return sendError(res, "Status must be 'accepted' or 'rejected'.", 400, "INVALID_STATUS");
    }

    const group = await CompanionGroup.findById(id);
    if (!group) return sendError(res, "Group not found.", 404, "NOT_FOUND");

    if (group.creatorId.toString() !== req.user._id.toString()) {
      return sendError(res, "Only the group leader can accept/reject requests.", 403, "FORBIDDEN");
    }

    const request = group.joinRequests.id(reqId);
    if (!request) return sendError(res, "Join request not found.", 404, "NOT_FOUND");

    request.status = status;

    if (status === "accepted") {
      group.members.push({
        userId: request.userId,
        name: request.name,
        avatar: request.avatar,
        role: "member",
        joinedAt: new Date()
      });
      group.travelersCount += 1;
      if (group.travelersCount >= group.travelersNeeded + 1) {
        group.status = "full";
      }
    }

    await group.save();
    return sendSuccess(res, group, `Request ${status} successfully.`);
  } catch (error) {
    next(error);
  }
};

export const leaveGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const group = await CompanionGroup.findById(id);
    if (!group) return sendError(res, "Group not found.", 404, "NOT_FOUND");

    group.members = group.members.filter((m) => m.userId.toString() !== req.user._id.toString());
    group.travelersCount = Math.max(1, group.travelersCount - 1);
    if (group.status === "full") group.status = "open";

    await group.save();
    return sendSuccess(res, group, "You have left the travel group.");
  } catch (error) {
    next(error);
  }
};

export const reportUser = async (req, res, next) => {
  try {
    const { targetUserId, reason, details } = req.body;
    const report = new Report({
      reporterId: req.user._id,
      targetType: "user",
      targetId: targetUserId,
      reason,
      details
    });

    await report.save();
    return sendSuccess(res, {}, "Report filed with YĀTRI Trust & Safety team.", 201);
  } catch (error) {
    next(error);
  }
};
