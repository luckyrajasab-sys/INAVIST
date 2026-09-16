let ioInstance = null;

export const setSOSSocketIO = (io) => {
  ioInstance = io;
};

export const broadcastSOSEvent = (sosEvent) => {
  if (!ioInstance) return;

  // Broadcast to admin command monitoring room
  ioInstance.to("admin:monitoring").emit("emergency:sos", sosEvent);

  // Broadcast to all active dispatch monitors
  ioInstance.emit("emergency:broadcast", {
    sosId: sosEvent._id,
    userName: sosEvent.userName,
    userPhone: sosEvent.userPhone,
    location: sosEvent.location,
    status: sosEvent.status,
    timestamp: sosEvent.createdAt
  });
};
