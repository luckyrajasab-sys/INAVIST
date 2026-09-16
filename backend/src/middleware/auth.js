import { verifyAccessToken } from "../utils/jwt.js";
import { sendError } from "../utils/apiResponse.js";
import { User } from "../models/User.js";

/**
 * Authentication Middleware: Validates Bearer JWT Token and attaches user to req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "Access denied. No authentication token provided.", 401, "UNAUTHORIZED");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    if (!decoded || !decoded.userId) {
      return sendError(res, "Invalid or expired authentication token.", 401, "TOKEN_EXPIRED");
    }

    const user = await User.findById(decoded.userId).select("-passwordHash -refreshTokens");
    if (!user || !user.isActive) {
      return sendError(res, "User account is suspended or no longer exists.", 401, "USER_INACTIVE");
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, "Authentication failed.", 500, "AUTH_ERROR", error.message);
  }
};

/**
 * Optional Authentication: Attaches req.user if token is valid, otherwise proceeds without error
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = verifyAccessToken(token);
      if (decoded && decoded.userId) {
        const user = await User.findById(decoded.userId).select("-passwordHash -refreshTokens");
        if (user && user.isActive) {
          req.user = user;
        }
      }
    }
    next();
  } catch (err) {
    next();
  }
};
