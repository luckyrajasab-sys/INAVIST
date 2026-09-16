import { Hotel } from "../models/Hotel.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const searchHotels = async (req, res, next) => {
  try {
    const {
      city,
      state,
      destinationId,
      type,
      minPrice,
      maxPrice,
      minRating,
      amenities,
      limit = 30
    } = req.query;

    const query = {};

    if (city) query.city = new RegExp(city, "i");
    if (state) query.state = new RegExp(state, "i");
    if (destinationId) query.destinationId = destinationId;
    if (type && type !== "all") query.type = type;

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (amenities) {
      const amenitiesArr = amenities.split(",").map((a) => a.trim());
      query.amenities = { $all: amenitiesArr.map((a) => new RegExp(a, "i")) };
    }

    const hotels = await Hotel.find(query).limit(Number(limit)).sort({ rating: -1 }).lean();
    return sendSuccess(res, hotels, `Found ${hotels.length} accommodations.`);
  } catch (error) {
    next(error);
  }
};

export const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findOne({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    }).lean();

    if (!hotel) {
      return sendError(res, `Hotel not found with id: ${id}`, 404, "NOT_FOUND");
    }

    return sendSuccess(res, hotel, "Hotel details fetched.");
  } catch (error) {
    next(error);
  }
};

export const createHotel = async (req, res, next) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    return sendSuccess(res, hotel, "Accommodation created successfully.", 201);
  } catch (error) {
    next(error);
  }
};
