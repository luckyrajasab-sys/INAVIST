import { Server } from "socket.io";
import { setAlertSocketIO } from "./alertSocket.js";
import { setSOSSocketIO } from "./sosSocket.js";
import { setCompanionSocketIO, registerCompanionHandlers } from "./companionSocket.js";
import { setNotificationSocketIO } from "./notificationSocket.js";
import { logger } from "../utils/logger.js";

export const initSockets = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Attach io to socket sub-modules
  setAlertSocketIO(io);
  setSOSSocketIO(io);
  setCompanionSocketIO(io);
  setNotificationSocketIO(io);

  io.on("connection", (socket) => {
    logger.info(`Client connected to Socket.IO: ${socket.id}`);

    // Join user-specific notification channel
    socket.on("user:subscribe", (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    // Join destination-specific weather & travel alert room
    socket.on("destination:subscribe", (destId) => {
      if (destId) {
        socket.join(`dest:${destId}`);
      }
    });

    // Leave destination room
    socket.on("destination:unsubscribe", (destId) => {
      if (destId) {
        socket.leave(`dest:${destId}`);
      }
    });

    // Join admin monitoring room
    socket.on("admin:subscribe", () => {
      socket.join("admin:monitoring");
    });

    // Register companion group chat handlers
    registerCompanionHandlers(socket, io);

    socket.on("disconnect", () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};
