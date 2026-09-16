import { GovScheme } from "../models/GovScheme.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getGovSchemes = async (req, res, next) => {
  try {
    const { state, category } = req.query;
    const query = {};

    if (state && state !== "all") query.state = new RegExp(state, "i");
    if (category && category !== "all") query.category = new RegExp(category, "i");

    const schemes = await GovScheme.find(query).lean();
    return sendSuccess(res, schemes, "Government Tourism schemes fetched.");
  } catch (error) {
    next(error);
  }
};
