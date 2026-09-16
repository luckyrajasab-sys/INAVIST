// BudgetService.js — Budget-Based Destination Discovery & Cost Breakdown

import { destinationsData } from "../data/destinationsData";
import { RouteService } from "./RouteService";

export class BudgetService {
  /**
   * Filter and suggest matching destinations based on user's target budget
   * Returns complete breakdowns (Transport + Stay + Food + Local Transit + Entry)
   */
  static getBudgetMatchingDestinations({
    userBudget = 5000,
    fromCity = "Chennai",
    travellers = 1,
    durationDays = 2
  }) {
    const budget = Number(userBudget) || 5000;

    const results = destinationsData.map((dest) => {
      const distanceKm = RouteService.getEstimatedDistanceKm(fromCity, dest.name);

      // Estimated breakdown for this destination
      const estimatedTransport = Math.round(distanceKm * 0.9 + 150) * 2; // Round trip
      const stayPerDay = dest.estimatedCosts?.stay || 1800;
      const totalStay = stayPerDay * Math.max(1, durationDays - 1);
      const foodPerDay = dest.estimatedCosts?.food || 600;
      const totalFood = foodPerDay * durationDays * travellers;
      const localTransport = (dest.estimatedCosts?.activities || 400) + 300;
      const entryFees = (dest.entryFee || 100) * travellers;

      const grandTotal = Math.round(
        estimatedTransport * travellers + totalStay + totalFood + localTransport + entryFees
      );

      const isWithinBudget = grandTotal <= budget * 1.15; // 15% buffer
      const savings = budget - grandTotal;

      return {
        ...dest,
        estimatedTotalCost: grandTotal,
        costFormatted: `₹${grandTotal.toLocaleString("en-IN")}`,
        isWithinBudget,
        savings,
        savingsFormatted: savings >= 0 ? `₹${savings.toLocaleString("en-IN")} within budget` : `₹${Math.abs(savings).toLocaleString("en-IN")} over budget`,
        distanceKm,
        breakdown: {
          transport: estimatedTransport * travellers,
          stay: totalStay,
          food: totalFood,
          localTransport,
          entryFees
        }
      };
    });

    // Sort by best match (within budget first, then lowest cost)
    return results
      .filter((r) => r.isWithinBudget)
      .sort((a, b) => a.estimatedTotalCost - b.estimatedTotalCost);
  }

  /**
   * Budget category tiers for quick pill filtering
   */
  static getBudgetTiers() {
    return [
      { id: "tier-500", label: "Under ₹500", min: 0, max: 500, icon: "Wallet" },
      { id: "tier-1000", label: "₹500 – ₹1,000", min: 500, max: 1000, icon: "Wallet" },
      { id: "tier-2500", label: "₹1,000 – ₹2,500", min: 1000, max: 2500, icon: "Wallet" },
      { id: "tier-5000", label: "₹2,500 – ₹5,000", min: 2500, max: 5000, icon: "Wallet" },
      { id: "tier-plus", label: "₹5,000+", min: 5000, max: 100000, icon: "Sparkles" }
    ];
  }
}
