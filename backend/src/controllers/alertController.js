import { Alert } from "../models/Alert.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { broadcastAlert } from "../sockets/alertSocket.js";

export const getAlerts = async (req, res, next) => {
  try {
    const { destinationId, state, severity, limit = 20 } = req.query;
    const query = { isActive: true };

    if (destinationId) query.destinationId = destinationId;
    if (state) query.state = new RegExp(`^${state}$`, "i");
    if (severity) query.severity = severity;

    const alerts = await Alert.find(query).sort({ createdAt: -1 }).limit(Number(limit)).lean();
    return sendSuccess(res, alerts, "Active travel alerts fetched.");
  } catch (error) {
    next(error);
  }
};

export const getAlertsByDestination = async (req, res, next) => {
  try {
    const { destId } = req.params;
    const alerts = await Alert.find({
      destinationId: destId,
      isActive: true
    }).sort({ createdAt: -1 }).lean();

    return sendSuccess(res, alerts, `Alerts for ${destId} fetched.`);
  } catch (error) {
    next(error);
  }
};

export const createAlert = async (req, res, next) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();

    // Broadcast in real-time over Socket.IO
    broadcastAlert(alert);

    return sendSuccess(res, alert, "Travel alert published & broadcast in real-time.", 201);
  } catch (error) {
    next(error);
  }
};

export const deleteAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Alert.findByIdAndUpdate(id, { isActive: false });
    return sendSuccess(res, {}, "Alert marked as inactive.");
  } catch (error) {
    next(error);
  }
};
