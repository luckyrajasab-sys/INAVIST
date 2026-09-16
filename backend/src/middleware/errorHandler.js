import { sendError } from "../utils/apiResponse.js";
import { logger } from "../utils/logger.js";

/**
 * Centralized Error Handling Middleware for Express
 */
export const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} - Error:`, err);

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return sendError(res, "Validation failed", 400, "VALIDATION_ERROR", messages);
  }

  // Mongoose Duplicate Key Error (e.g. unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, `Duplicate field value entered for '${field}'. Please use another value.`, 400, "DUPLICATE_KEY_ERROR");
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return sendError(res, `Resource not found with ID: ${err.value}`, 404, "RESOURCE_NOT_FOUND");
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    return sendError(res, "Invalid token. Please authenticate again.", 401, "INVALID_TOKEN");
  }
  if (err.name === "TokenExpiredError") {
    return sendError(res, "Token expired. Please login again.", 401, "TOKEN_EXPIRED");
  }

  // Multer Upload Errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return sendError(res, "File size limit exceeded. Maximum file size is 5MB.", 400, "FILE_TOO_LARGE");
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error occurred";
  const errorCode = err.errorCode || "INTERNAL_SERVER_ERROR";

  return sendError(res, message, statusCode, errorCode, process.env.NODE_ENV !== "production" ? err.stack : null);
};

export const notFoundHandler = (req, res) => {
  return sendError(res, `API route '${req.originalUrl}' not found on this server.`, 404, "ROUTE_NOT_FOUND");
};
