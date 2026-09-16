let ioInstance = null;

export const setAlertSocketIO = (io) => {
  ioInstance = io;
};

export const broadcastAlert = (alert) => {
  if (!ioInstance) return;

  // Broadcast to specific destination room if applicable
  if (alert.destinationId) {
    ioInstance.to(`dest:${alert.destinationId}`).emit("alert:new", alert);
  }

  // Also broadcast globally to all active app users
  ioInstance.emit("alert:global", alert);
};
