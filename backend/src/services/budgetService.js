import { Destination } from "../models/Destination.js";

/**
 * Smart Budget Service
 * Calculates accurate expense breakdowns and matches realistic destinations/trips
 */
export const calculateTripBudget = ({
  budget,
  travelers = 1,
  durationDays = 3,
  travelStyle = "moderate",
  destinationId = null
}) => {
  const travelersNum = Math.max(1, Number(travelers));
  const daysNum = Math.max(1, Number(durationDays));
  const totalBudget = Number(budget);

  // Cost multipliers based on travel style
  const styleMultipliers = {
    backpacker: { stay: 0.5, food: 0.6, travel: 0.7, activities: 0.6 },
    budget: { stay: 0.8, food: 0.8, travel: 0.8, activities: 0.8 },
    moderate: { stay: 1.0, food: 1.0, travel: 1.0, activities: 1.0 },
    luxury: { stay: 2.5, food: 2.2, travel: 2.0, activities: 2.0 }
  };

  const multiplier = styleMultipliers[travelStyle] || styleMultipliers.moderate;

  // Base daily rates (in INR)
  const baseTransportPerPerson = 1200 * multiplier.travel;
  const baseStayPerRoomNight = 1800 * multiplier.stay; // Assume 2 travelers per room
  const roomsNeeded = Math.ceil(travelersNum / 2);
  const baseFoodPerPersonPerDay = 600 * multiplier.food;
  const baseActivitiesPerPersonPerDay = 350 * multiplier.activities;
  const baseEntryFeesPerPerson = 200;
  const baseLocalTransportPerDay = 500;

  const totalTransport = baseTransportPerPerson * travelersNum;
  const totalStay = baseStayPerRoomNight * roomsNeeded * daysNum;
  const totalFood = baseFoodPerPersonPerDay * travelersNum * daysNum;
  const totalActivities = baseActivitiesPerPersonPerDay * travelersNum * daysNum;
  const totalEntryFees = baseEntryFeesPerPerson * travelersNum;
  const totalLocalTransport = baseLocalTransportPerDay * daysNum;

  const subTotal = totalTransport + totalStay + totalFood + totalActivities + totalEntryFees + totalLocalTransport;
  const emergencyReserve = Math.round(subTotal * 0.10); // 10% emergency buffer
  const miscellaneous = Math.round(subTotal * 0.05); // 5% miscellaneous
  const estimatedGrandTotal = subTotal + emergencyReserve + miscellaneous;

  const perPersonCost = Math.round(estimatedGrandTotal / travelersNum);
  const isWithinBudget = totalBudget >= estimatedGrandTotal;
  const budgetDifference = totalBudget - estimatedGrandTotal;

  return {
    travelers: travelersNum,
    durationDays: daysNum,
    travelStyle,
    breakdown: {
      transportation: Math.round(totalTransport),
      accommodation: Math.round(totalStay),
      foodAndDining: Math.round(totalFood),
      activitiesAndSightseeing: Math.round(totalActivities),
      entryFees: Math.round(totalEntryFees),
      localCommute: Math.round(totalLocalTransport),
      emergencyReserve,
      miscellaneous
    },
    totalEstimatedCost: Math.round(estimatedGrandTotal),
    perPersonCost,
    userBudget: totalBudget,
    isWithinBudget,
    budgetDifference, // Positive means surplus, negative means deficit
    savingsTips: [
      "Book state transport buses or sleeper trains to save on inter-city transit.",
      "Opt for verified government homestays or Zostel hostels for safe budget lodging.",
      "Eat at high-rated authentic local thali spots for hygienic and affordable dining.",
      "Travel in a group of 2-4 to split cab and room costs effectively."
    ]
  };
};

/**
 * Recommend Destinations that realistically fit the user's budget, traveler count, and duration
 */
export const recommendDestinationsForBudget = async ({
  budget,
  travelers = 1,
  durationDays = 3,
  travelStyle = "moderate",
  category = null
}) => {
  const travelersNum = Math.max(1, Number(travelers));
  const daysNum = Math.max(1, Number(durationDays));
  const totalBudget = Number(budget);

  const query = {};
  if (category && category !== "all") {
    query.category = category;
  }

  const destinations = await Destination.find(query).lean();

  const recommended = destinations
    .map((dest) => {
      const stayCostPerNight = (dest.estimatedCosts?.stay || 1500);
      const foodPerDay = (dest.estimatedCosts?.food || 600);
      const travelEstimate = (dest.estimatedCosts?.travel || 1200);
      const entryFee = (dest.entryFee || 50);
      const activities = (dest.estimatedCosts?.activities || 300);

      const rooms = Math.ceil(travelersNum / 2);
      const stayTotal = stayCostPerNight * rooms * daysNum;
      const foodTotal = foodPerDay * travelersNum * daysNum;
      const travelTotal = travelEstimate * travelersNum;
      const activitiesTotal = (activities + entryFee) * travelersNum * daysNum;

      const subtotal = stayTotal + foodTotal + travelTotal + activitiesTotal;
      const totalEstimated = Math.round(subtotal * 1.15); // +15% reserve & misc
      const perPerson = Math.round(totalEstimated / travelersNum);

      return {
        ...dest,
        calculatedTripCost: totalEstimated,
        costPerPerson: perPerson,
        budgetFitScore: Math.max(0, 100 - Math.abs(totalBudget - totalEstimated) / (totalBudget || 1) * 100),
        isAffordable: totalEstimated <= totalBudget
      };
    })
    .filter((d) => d.isAffordable || d.calculatedTripCost <= totalBudget * 1.25)
    .sort((a, b) => b.budgetFitScore - a.budgetFitScore)
    .slice(0, 12);

  return {
    userBudget: totalBudget,
    travelers: travelersNum,
    durationDays: daysNum,
    recommendationsCount: recommended.length,
    recommendations: recommended
  };
};
