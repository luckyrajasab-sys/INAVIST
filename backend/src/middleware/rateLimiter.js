import rateLimit from "express-rate-limit";
import { sendError } from "../utils/apiResponse.js";

/**
 * Standard API Rate Limiter
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(res, "Too many requests from this IP. Please try again later.", 429, "RATE_LIMIT_EXCEEDED");
  }
});

/**
 * Stricter Rate Limiter for Authentication and SOS Endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 auth requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(res, "Too many authentication attempts. Please wait 15 minutes before trying again.", 429, "AUTH_RATE_LIMIT_EXCEEDED");
  }
});
