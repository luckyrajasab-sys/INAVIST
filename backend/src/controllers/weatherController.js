import { getWeatherForLocation } from "../services/weatherService.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getWeather = async (req, res, next) => {
  try {
    const { location = "New Delhi", lat, lng } = req.query;
    const weather = await getWeatherForLocation(location, lat, lng);
    return sendSuccess(res, weather, `Weather for ${location} fetched.`);
  } catch (error) {
    next(error);
  }
};
