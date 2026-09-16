let ioInstance = null;

export const setCompanionSocketIO = (io) => {
  ioInstance = io;
};

export const registerCompanionHandlers = (socket, io) => {
  // Join travel companion group live discussion
  socket.on("group:join_room", (groupId) => {
    socket.join(`group:${groupId}`);
  });

  // Leave group room
  socket.on("group:leave_room", (groupId) => {
    socket.leave(`group:${groupId}`);
  });

  // Send real-time chat message to group room
  socket.on("group:send_message", ({ groupId, sender, text, time }) => {
    io.to(`group:${groupId}`).emit("group:message_received", {
      groupId,
      sender,
      text,
      time: time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });
  });
};
