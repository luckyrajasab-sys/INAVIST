import { Destination } from "../models/Destination.js";
import { sendSuccess, sendPaginated, sendError } from "../utils/apiResponse.js";
import { destinationSchema } from "../validators/index.js";

export const getAllDestinations = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      state,
      district,
      region,
      category,
      isHiddenGem,
      minRating,
      maxBudget,
      sort = "rating_desc"
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { state: new RegExp(search, "i") },
        { district: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }

    if (state && state !== "All" && state !== "all") {
      query.state = new RegExp(`^${state}$`, "i");
    }

    if (district && district !== "All" && district !== "all") {
      query.district = new RegExp(`^${district}$`, "i");
    }

    if (region && region !== "All" && region !== "all") {
      query.region = new RegExp(`^${region}$`, "i");
    }

    if (category && category !== "All" && category !== "all") {
      query.category = new RegExp(`^${category}$`, "i");
    }

    if (isHiddenGem !== undefined) {
      query.isHiddenGem = isHiddenGem === "true" || isHiddenGem === true;
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (maxBudget) {
      query["estimatedCosts.stay"] = { $lte: Number(maxBudget) };
    }

    let sortObj = { rating: -1 };
    if (sort === "rating_desc") sortObj = { rating: -1 };
    else if (sort === "rating_asc") sortObj = { rating: 1 };
    else if (sort === "cost_asc") sortObj = { "estimatedCosts.stay": 1 };
    else if (sort === "cost_desc") sortObj = { "estimatedCosts.stay": -1 };
    else if (sort === "name_asc") sortObj = { name: 1 };
    else if (sort === "popularity") sortObj = { popularityScore: -1, reviewsCount: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [total, destinations] = await Promise.all([
      Destination.countDocuments(query),
      Destination.find(query).sort(sortObj).skip(skip).limit(limitNum).lean()
    ]);

    return sendPaginated(res, destinations, total, pageNum, limitNum, "Destinations retrieved successfully.");
  } catch (error) {
    next(error);
  }
};

export const getDestinationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findOne({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    }).lean();

    if (!destination) {
      return sendError(res, `Destination not found with id: ${id}`, 404, "NOT_FOUND");
    }

    return sendSuccess(res, destination, "Destination details fetched.");
  } catch (error) {
    next(error);
  }
};

export const getDestinationsByState = async (req, res, next) => {
  try {
    const { state } = req.params;
    const destinations = await Destination.find({
      state: new RegExp(`^${state}$`, "i")
    }).sort({ rating: -1 }).lean();

    return sendSuccess(res, destinations, `Destinations in state ${state} fetched.`);
  } catch (error) {
    next(error);
  }
};

export const getDestinationsByDistrict = async (req, res, next) => {
  try {
    const { district } = req.params;
    const destinations = await Destination.find({
      district: new RegExp(`^${district}$`, "i")
    }).sort({ rating: -1 }).lean();

    return sendSuccess(res, destinations, `Destinations in district ${district} fetched.`);
  } catch (error) {
    next(error);
  }
};

export const searchDestinations = async (req, res, next) => {
  try {
    const { q, limit = 20 } = req.query;
    if (!q) {
      return sendSuccess(res, [], "No query provided.");
    }

    const regex = new RegExp(q, "i");
    const results = await Destination.find({
      $or: [
        { name: regex },
        { state: regex },
        { district: regex },
        { category: regex },
        { tags: { $in: [regex] } },
        { description: regex }
      ]
    }).limit(Number(limit)).lean();

    return sendSuccess(res, results, `Found ${results.length} destinations.`);
  } catch (error) {
    next(error);
  }
};

export const getNearbyDestinations = async (req, res, next) => {
  try {
    const { lat, lng, maxDistanceKm = 100, limit = 10 } = req.query;
    if (!lat || !lng) {
      return sendError(res, "Query parameters 'lat' and 'lng' are required.", 400, "MISSING_COORDINATES");
    }

    const latitude = Number(lat);
    const longitude = Number(lng);
    const maxMeters = Number(maxDistanceKm) * 1000;

    let nearby = [];
    try {
      nearby = await Destination.find({
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            $maxDistance: maxMeters
          }
        }
      }).limit(Number(limit)).lean();
    } catch (geoErr) {
      // Fallback distance calculation using Haversine if geospatial index not yet synced
      const allDests = await Destination.find().lean();
      nearby = allDests
        .map((d) => {
          const dist = calculateHaversineKm(latitude, longitude, d.coordinates.lat, d.coordinates.lng);
          return { ...d, distanceKm: Math.round(dist) };
        })
        .filter((d) => d.distanceKm <= Number(maxDistanceKm))
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, Number(limit));
    }

    return sendSuccess(res, nearby, `Found ${nearby.length} nearby destinations.`);
  } catch (error) {
    next(error);
  }
};

const calculateHaversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const createDestination = async (req, res, next) => {
  try {
    const { error, value } = destinationSchema.validate(req.body);
    if (error) return sendError(res, error.details[0].message, 400, "VALIDATION_ERROR");

    const id = value.id || value.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const existing = await Destination.findOne({ id });
    if (existing) {
      return sendError(res, "A destination with this ID already exists.", 400, "DUPLICATE_ID");
    }

    const destination = new Destination({
      ...value,
      id,
      location: {
        type: "Point",
        coordinates: [value.coordinates.lng, value.coordinates.lat]
      }
    });

    await destination.save();
    return sendSuccess(res, destination, "Destination created successfully.", 201);
  } catch (error) {
    next(error);
  }
};

export const updateDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!destination) {
      return sendError(res, `Destination not found with id: ${id}`, 404, "NOT_FOUND");
    }

    return sendSuccess(res, destination, "Destination updated successfully.");
  } catch (error) {
    next(error);
  }
};

export const deleteDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Destination.findOneAndDelete({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    });

    if (!deleted) {
      return sendError(res, `Destination not found with id: ${id}`, 404, "NOT_FOUND");
    }

    return sendSuccess(res, {}, "Destination deleted successfully.");
  } catch (error) {
    next(error);
  }
};
