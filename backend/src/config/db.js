import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { logger } from "../utils/logger.js";

let mongodInstance = null;

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    const useMemory = process.env.USE_MEMORY_DB === "true";

    // If local/Atlas URI is provided and memory DB is not strictly forced, try connecting
    if (uri && !useMemory) {
      try {
        await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 4000
        });
        logger.info(`MongoDB connected to external cluster: ${uri.split("@")[1] || uri}`);
        return;
      } catch (err) {
        logger.warn(`External MongoDB connection failed (${err.message}). Falling back to In-Memory MongoDB Server for smooth local execution.`);
      }
    }

    // Launch In-Memory MongoDB for effortless local development and tests
    if (!mongodInstance) {
      mongodInstance = await MongoMemoryServer.create();
    }
    const memoryUri = mongodInstance.getUri();
    await mongoose.connect(memoryUri);
    logger.info(`MongoDB connected successfully via In-Memory Server: ${memoryUri}`);
  } catch (error) {
    logger.error("MongoDB Connection Fatal Error:", error);
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
      mongodInstance = null;
    }
    logger.info("MongoDB disconnected successfully.");
  } catch (error) {
    logger.error("Error disconnecting MongoDB:", error);
  }
};
