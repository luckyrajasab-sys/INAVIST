let ioInstance = null;

export const setNotificationSocketIO = (io) => {
  ioInstance = io;
};

export const sendRealtimeNotification = (userId, notification) => {
  if (!ioInstance) return;
  ioInstance.to(`user:${userId}`).emit("notification:new", notification);
};
