import { SOS } from "../models/SOS.js";
import { User } from "../models/User.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { sosSchema } from "../validators/index.js";
import { sendSOSNotificationEmail } from "../services/emailService.js";
import { broadcastSOSEvent } from "../sockets/sosSocket.js";

export const triggerSOS = async (req, res, next) => {
  try {
    const { error, value } = sosSchema.validate(req.body);
    if (error) return sendError(res, error.details[0].message, 400, "VALIDATION_ERROR");

    const user = req.user || {
      _id: null,
      name: "Emergency Guest Traveler",
      phone: "+91 99999 00000",
      email: "guest@yatri.com",
      emergencyContacts: []
    };

    const contactsNotified = (user.emergencyContacts || []).map((c) => ({
      name: c.name,
      phone: c.phone,
      status: "queued"
    }));

    const sosEvent = new SOS({
      userId: user._id,
      userName: user.name,
      userPhone: user.phone,
      userEmail: user.email,
      location: value.location,
      message: value.message,
      emergencyContactsNotified: contactsNotified,
      status: "triggered"
    });

    await sosEvent.save();

    // Dispatch background email alerts to emergency contacts
    for (const c of user.emergencyContacts || []) {
      if (c.email) {
        sendSOSNotificationEmail({
          to: c.email,
          travelerName: user.name,
          location: value.location,
          time: new Date().toLocaleString()
        });
      }
    }

    // Broadcast over Socket.IO to emergency dispatcher / admin command room
    broadcastSOSEvent(sosEvent);

    return sendSuccess(res, {
      sosId: sosEvent._id,
      status: sosEvent.status,
      timestamp: sosEvent.createdAt,
      contactsNotifiedCount: contactsNotified.length,
      location: sosEvent.location,
      dispatchHelpline: "112 (National Emergency)",
      touristPoliceHelpline: "1363 (24x7 Multi-Lingual Tourist Helpline)"
    }, "🚨 SOS Signal Recorded. Emergency coordinates dispatched to YĀTRI Safety Network.", 201);
  } catch (error) {
    next(error);
  }
};

export const getSOSHistory = async (req, res, next) => {
  try {
    const query = req.user?.role === "admin" ? {} : { userId: req.user?._id };
    const history = await SOS.find(query).sort({ createdAt: -1 }).limit(30).lean();
    return sendSuccess(res, history, "SOS history fetched.");
  } catch (error) {
    next(error);
  }
};

export const resolveSOS = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;

    const sos = await SOS.findByIdAndUpdate(
      id,
      {
        status: "resolved",
        resolutionNotes: resolutionNotes || "Resolved by safety dispatcher",
        resolvedAt: new Date()
      },
      { new: true }
    );

    if (!sos) return sendError(res, "SOS event not found.", 404, "NOT_FOUND");
    return sendSuccess(res, sos, "SOS event marked as resolved.");
  } catch (error) {
    next(error);
  }
};
