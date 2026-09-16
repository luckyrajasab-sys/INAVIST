import { sendError } from "../utils/apiResponse.js";

/**
 * Role Authorization Middleware
 * Usage: authorizeRoles("admin", "moderator")
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, "Authentication required.", 401, "UNAUTHORIZED");
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`, 403, "FORBIDDEN");
    }

    next();
  };
};
