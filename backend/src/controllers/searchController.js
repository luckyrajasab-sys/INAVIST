import { Destination } from "../models/Destination.js";
import { Hotel } from "../models/Hotel.js";
import { CompanionGroup } from "../models/CompanionGroup.js";
import { TravelSearchService } from "../services/travelSearchService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * Universal general text search (destinations, hotels, companion groups)
 */
export const universalSearch = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;
    if (!q || q.trim() === "") {
      return sendSuccess(res, { destinations: [], hotels: [], companionGroups: [] }, "Empty query provided.");
    }

    const regex = new RegExp(q.trim(), "i");
    const limitNum = Number(limit);

    const [destinations, hotels, companionGroups] = await Promise.all([
      Destination.find({
        $or: [
          { name: regex },
          { state: regex },
          { district: regex },
          { category: regex },
          { tags: { $in: [regex] } },
          { description: regex }
        ]
      }).limit(limitNum).lean(),

      Hotel.find({
        $or: [
          { name: regex },
          { city: regex },
          { state: regex },
          { amenities: { $in: [regex] } }
        ]
      }).limit(limitNum).lean(),

      CompanionGroup.find({
        status: "open",
        $or: [
          { title: regex },
          { destination: regex },
          { interests: { $in: [regex] } }
        ]
      }).limit(limitNum).lean()
    ]);

    return sendSuccess(res, {
      query: q,
      counts: {
        destinations: destinations.length,
        hotels: hotels.length,
        companionGroups: companionGroups.length
      },
      destinations,
      hotels,
      companionGroups
    }, "Universal search completed.");
  } catch (error) {
    next(error);
  }
};

/**
 * Advanced Travel Route Search across all sectors (Train, Bus, Flight, Cab, Multi-Modal)
 */
export const searchTravelRoutes = async (req, res, next) => {
  try {
    const {
      fromCity = "Chennai",
      toDestination = "Goa",
      travelDate = new Date().toISOString().split("T")[0],
      passengers = 1,
      travelPreference = "all"
    } = req.body;

    if (!fromCity || !toDestination) {
      return sendError(res, "Both origin 'fromCity' and destination 'toDestination' are required.", 400);
    }

    if (fromCity.trim().toLowerCase() === toDestination.trim().toLowerCase()) {
      return sendError(res, "Origin and Destination cannot be the same location.", 400);
    }

    const results = await TravelSearchService.searchRoutes({
      fromCity: fromCity.trim(),
      toDestination: toDestination.trim(),
      travelDate,
      passengers: Number(passengers) || 1,
      travelPreference
    });

    return sendSuccess(res, results, "Travel routes retrieved successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * Autocomplete location suggestions (cities, railway stations, airports, districts)
 */
export const getLocationSuggestions = async (req, res, next) => {
  try {
    const { q = "" } = req.query;
    if (!q || q.trim().length < 1) {
      // Popular defaults
      const popular = [
        { name: "Chennai", type: "Metro & Airport Hub", state: "Tamil Nadu", code: "MAA" },
        { name: "Goa", type: "Coastal Destination & Airport", state: "Goa", code: "GOI" },
        { name: "Delhi", type: "Capital & Airport Hub", state: "Delhi", code: "DEL" },
        { name: "Bengaluru", type: "Metro & Tech Hub", state: "Karnataka", code: "BLR" },
        { name: "Kodaikanal", type: "Hill Station & Tourist Hub", state: "Tamil Nadu", code: "KOD" },
        { name: "Varanasi", type: "Sacred Heritage City", state: "Uttar Pradesh", code: "BSB" },
        { name: "Leh Ladakh", type: "High Altitude Explorer", state: "Ladakh", code: "IXL" },
        { name: "Munnar", type: "Tea Valley & Hill Resort", state: "Kerala", code: "COK" },
        { name: "Mumbai", type: "Financial Metro Hub", state: "Maharashtra", code: "BOM" },
        { name: "Manali", type: "Himalayan Snow Resort", state: "Himachal Pradesh", code: "KUU" }
      ];
      return sendSuccess(res, popular, "Popular locations retrieved.");
    }

    const regex = new RegExp(q.trim(), "i");
    const dests = await Destination.find({
      $or: [{ name: regex }, { state: regex }, { district: regex }]
    }).limit(8).lean();

    const formatted = dests.map((d) => ({
      name: d.name,
      type: `${d.category || "Tourist Location"} • ${d.district || ""}`,
      state: d.state,
      code: (d.district || d.name).slice(0, 3).toUpperCase()
    }));

    return sendSuccess(res, formatted, "Location suggestions found.");
  } catch (error) {
    next(error);
  }
};
