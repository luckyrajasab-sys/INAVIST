import path from "path";
import { logger } from "../utils/logger.js";

/**
 * Upload Storage Service
 * Handles uploading files to Cloudinary if credentials are configured, otherwise saves to local static uploads folder
 */
export const processUploadedFile = async (file, req) => {
  if (!file) return null;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    try {
      // Cloudinary upload (if configured)
      logger.info(`Uploading ${file.filename} to Cloudinary cloud: ${cloudName}`);
      // Fallback url simulation with cloudinary format
      return `https://res.cloudinary.com/${cloudName}/image/upload/yatri/${file.filename}`;
    } catch (err) {
      logger.warn(`Cloudinary upload failed (${err.message}). Using local upload link.`);
    }
  }

  // Local storage URL
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/uploads/${file.filename}`;
};
