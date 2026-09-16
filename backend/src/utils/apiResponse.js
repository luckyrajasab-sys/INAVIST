/**
 * Standardized API Response Utilities for YĀTRI Backend
 */

export const sendSuccess = (res, data = {}, message = "Request successful", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendPaginated = (res, data = [], total = 0, page = 1, limit = 10, message = "Data fetched successfully") => {
  const totalPages = Math.ceil(total / limit) || 1;
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
};

export const sendError = (res, message = "Something went wrong", statusCode = 500, error = "INTERNAL_SERVER_ERROR", details = null) => {
  const response = {
    success: false,
    message,
    error
  };

  if (details && process.env.NODE_ENV !== "production") {
    response.details = details;
  }

  return res.status(statusCode).json(response);
};
