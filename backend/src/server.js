import http from "http";
import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { initSockets } from "./sockets/index.js";
import { logger } from "./utils/logger.js";
import { seedInitialData } from "./scripts/seed.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to Database (with auto-memory fallback)
    await connectDB();

    // 2. Automatically seed if database is empty (e.g. In-Memory or fresh DB)
    await seedInitialData();

    // 3. Create HTTP server and initialize Socket.IO
    const httpServer = http.createServer(app);
    initSockets(httpServer);

    // 4. Start Listening
    const server = httpServer.listen(PORT, () => {
      logger.info(`🚀 [YĀTRI Backend Server] Running on http://localhost:${PORT}`);
      logger.info(`📖 [Swagger API Documentation] Available at http://localhost:${PORT}/api/docs`);
    });

    // Graceful Shutdown
    const handleShutdown = async (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        logger.info("HTTP Server and DB connections closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => handleShutdown("SIGINT"));
    process.on("SIGTERM", () => handleShutdown("SIGTERM"));
  } catch (error) {
    logger.error("Failed to start YĀTRI backend server:", error);
    process.exit(1);
  }
};

startServer();
