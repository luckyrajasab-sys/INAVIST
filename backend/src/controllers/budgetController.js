import { calculateTripBudget, recommendDestinationsForBudget } from "../services/budgetService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { budgetCalculateSchema } from "../validators/index.js";

export const calculateBudget = async (req, res, next) => {
  try {
    const { error, value } = budgetCalculateSchema.validate(req.body);
    if (error) return sendError(res, error.details[0].message, 400, "VALIDATION_ERROR");

    const result = calculateTripBudget(value);
    return sendSuccess(res, result, "Budget breakdown calculated successfully.");
  } catch (error) {
    next(error);
  }
};

export const recommendByBudget = async (req, res, next) => {
  try {
    const { budget, travelers = 1, durationDays = 3, travelStyle = "moderate", category } = req.body;

    if (!budget || Number(budget) <= 0) {
      return sendError(res, "Please provide a valid budget amount.", 400, "INVALID_BUDGET");
    }

    const recommendations = await recommendDestinationsForBudget({
      budget: Number(budget),
      travelers: Number(travelers),
      durationDays: Number(durationDays),
      travelStyle,
      category
    });

    return sendSuccess(res, recommendations, "Budget-matched destination recommendations generated.");
  } catch (error) {
    next(error);
  }
};
