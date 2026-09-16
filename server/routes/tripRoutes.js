import express from "express";
import { db } from "../data/db.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// GET /api/trips
router.get("/", (req, res) => {
  res.json({
    count: db.trips.length,
    trips: db.trips
  });
});

// GET /api/trips/:id
router.get("/:id", (req, res) => {
  const trip = db.trips.find((t) => t.id === req.params.id);
  if (!trip) {
    return res.status(404).json({ error: "Trip not found" });
  }
  res.json(trip);
});

// POST /api/trips (Create trip)
router.post("/", (req, res) => {
  const newTrip = {
    id: `trip-${Date.now()}`,
    status: "active",
    createdAt: new Date().toISOString().split("T")[0],
    ...req.body
  };
  db.trips.unshift(newTrip);
  res.status(201).json(newTrip);
});

// POST /api/trips/modify-crisis (The "Modify My Trip" Crisis Re-Planner Engine)
router.post("/modify-crisis", (req, res) => {
  const { currentPlan, crisisType, customProblem } = req.body;

  if (!currentPlan) {
    return res.status(400).json({ error: "Current trip plan is required" });
  }

  const originalTotal = currentPlan.totalEstimatedBudget || 30000;
  let problemDescription = "";
  let solutionDescription = "";
  let costDelta = 0;
  const updatedItinerary = JSON.parse(JSON.stringify(currentPlan.itinerary || []));

  switch (crisisType) {
    case "rain":
      problemDescription = "Heavy rain forecast for outdoor sightseeing/viewpoint activities.";
      solutionDescription = "Swapped open-air viewpoint excursions with local cultural craft museums, royal palace courtyards, and indoor spice tea tasting.";
      costDelta = -400; // slight savings on outdoor adventure permits
      if (updatedItinerary.length > 0) {
        updatedItinerary[0].theme = "Indoor Heritage & Cultural Exploration (Rain Adapted)";
        updatedItinerary[0].activities = [
          { time: "10:00 AM", title: "Regional Heritage & Textile Museum Visit", note: "Indoor guided historical walkthrough", cost: 200 },
          { time: "01:30 PM", title: "Traditional Thali Tasting Lunch", note: "Authentic local delicacies", cost: 450 },
          { time: "04:30 PM", title: "Indoor Spice & Artisan Handicraft Workshop", note: "Covered market demonstration", cost: 350 },
          { time: "07:30 PM", title: "Cultural Folk Music & Dinner at Covered Haveli", note: "Comfortable indoor evening", cost: 600 }
        ];
      }
      break;

    case "train-cancelled":
      problemDescription = "Scheduled train cancelled due to technical maintenance.";
      solutionDescription = "Rerouted to overnight AC Multi-Axle Volvo Sleeper with on-time morning arrival and direct hotel check-in.";
      costDelta = +850;
      break;

    case "transport-delayed":
      problemDescription = "Inbound transport delayed by 3 hours.";
      solutionDescription = "Deferred morning outdoor trek to tomorrow; added relaxing local cafe exploration and sunset promenade stroll.";
      costDelta = 0;
      break;

    case "budget-reduced":
      problemDescription = "User requested a ₹6,000 budget reduction.";
      solutionDescription = "Swapped premium hotel for top-rated verified eco-homestay and transitioned from private cabs to AC express transit.";
      costDelta = -6200;
      break;

    case "destination-closed":
      problemDescription = "Main monument / viewpoint temporarily closed for maintenance.";
      solutionDescription = "Instantly redirected to neighboring UNESCO secret stepwells and scenic valley overlooks within 15 km.";
      costDelta = -200;
      break;

    case "extend-trip":
      problemDescription = "User extending trip by 1 additional day.";
      solutionDescription = "Added an offbeat excursion to nearby living root bridges & pristine canyon viewpoints with homestay night.";
      costDelta = +3200;
      updatedItinerary.push({
        day: updatedItinerary.length + 1,
        theme: "Extended Hidden Gem Excursion",
        activities: [
          { time: "08:30 AM", title: "Hike to Untouched Waterfall Gorge", note: "Offbeat nature trail", cost: 400 },
          { time: "01:00 PM", title: "Village Organic Lunch", note: "Farm-to-table local meal", cost: 350 },
          { time: "05:00 PM", title: "Sunset River Point", note: "Peaceful reflection spot", cost: 0 }
        ],
        stayCost: 1800
      });
      break;

    default:
      problemDescription = customProblem || "Unforeseen itinerary disruption.";
      solutionDescription = "Rebalanced daily timetable with nearest high-rated alternatives.";
      costDelta = 0;
  }

  const newTotalCost = Math.max(0, originalTotal + costDelta);

  const modifiedPlan = {
    ...currentPlan,
    totalEstimatedBudget: newTotalCost,
    itinerary: updatedItinerary,
    crisisHistory: [
      ...(currentPlan.crisisHistory || []),
      {
        timestamp: new Date().toLocaleTimeString(),
        crisisType,
        problemDescription,
        solutionDescription,
        costDelta
      }
    ]
  };

  res.json({
    success: true,
    originalCost: originalTotal,
    newCost: newTotalCost,
    costDelta,
    problemDescription,
    solutionDescription,
    modifiedPlan
  });
});

export default router;
