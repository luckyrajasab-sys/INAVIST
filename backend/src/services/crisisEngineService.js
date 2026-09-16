/**
 * YĀTRI Crisis Engine & Itinerary Re-Router Service
 * Dynamically rescues itineraries impacted by bad weather, landslides, road closures, or budget emergencies.
 */

export const modifyPlanForCrisis = (currentPlan, crisisType, customProblem) => {
  const plan = currentPlan || {};
  const currentItinerary = Array.isArray(plan.itinerary) ? [...plan.itinerary] : [];
  let actionTaken = "";
  let safetyAdvice = "";
  let modifiedItinerary = [...currentItinerary];
  let budgetAdjustment = 0;

  switch (crisisType) {
    case "landslide":
    case "road_closure":
      actionTaken = "Re-routed high mountain pass activities to sheltered valley heritage sites and indoor cultural centres.";
      safetyAdvice = "Avoid highway passes; local traffic police recommend staying at valley base camps until clearance.";
      modifiedItinerary = currentItinerary.map((day) => ({
        ...day,
        theme: `${day.theme} (Safely Re-Routed to Valley Route)`,
        activities: (day.activities || []).map((act) => ({
          ...act,
          title: act.title.includes("Pass") || act.title.includes("Lake")
            ? `Protected Local Monastery & Heritage Craft Market (Bypassing closed mountain pass)`
            : act.title,
          cost: Math.round(act.cost * 0.85)
        }))
      }));
      budgetAdjustment = -800;
      break;

    case "heavy_rain":
    case "flood":
      actionTaken = "Swapped outdoor viewpoints and trekking trails with indoor museum visits, heritage art galleries, and culinary workshops.";
      safetyAdvice = "Stay clear of riverbanks, waterfalls, and steep gorges due to flash flood risks.";
      modifiedItinerary = currentItinerary.map((day) => ({
        ...day,
        theme: `${day.theme} (Monsoon-Safe Indoor Experience)`,
        activities: (day.activities || []).map((act) => ({
          ...act,
          title: act.title.includes("Trek") || act.title.includes("Sunrise") || act.title.includes("Dunes")
            ? `State Archaeological Museum & Traditional Culinary Tour`
            : act.title
        }))
      }));
      budgetAdjustment = -300;
      break;

    case "budget_crunch":
      actionTaken = "Replaced premium transport with luxury sleeper buses and switched luxury stay options to certified government eco-homestays.";
      safetyAdvice = "Travel in shared registered taxis and opt for verified local thali messes.";
      modifiedItinerary = currentItinerary.map((day) => ({
        ...day,
        stayCost: Math.round(day.stayCost * 0.6),
        activities: (day.activities || []).map((act) => ({
          ...act,
          cost: Math.round(act.cost * 0.5)
        }))
      }));
      budgetAdjustment = -Math.round((plan.totalEstimatedBudget || 20000) * 0.35);
      break;

    case "health_fatigue":
      actionTaken = "Relaxed pace with late morning starts, ayurvedic spa recovery, and gentle evening strolls.";
      safetyAdvice = "Hydrate with ORS/electrolyte water, rest for 24 hours, and keep emergency contact informed.";
      modifiedItinerary = currentItinerary.map((day, idx) => ({
        ...day,
        theme: `${day.theme} (Rest & Acclimatization Paced)`,
        activities: [
          { time: "11:00 AM", title: "Gentle Morning Heritage Walk / Local Garden", cost: 100 },
          { time: "04:30 PM", title: "Ayurvedic Herbal Wellness & Tea Tasting", cost: 600 }
        ]
      }));
      budgetAdjustment = -500;
      break;

    default:
      actionTaken = `Custom resolution applied for: "${customProblem || "Unexpected disruption"}"`;
      safetyAdvice = "Stay connected with YĀTRI SOS dispatch and verify road conditions with local helpline.";
      break;
  }

  const updatedBudget = Math.max(2000, (plan.totalEstimatedBudget || 15000) + budgetAdjustment);

  return {
    success: true,
    crisisType,
    customProblem,
    actionTaken,
    safetyAdvice,
    originalBudget: plan.totalEstimatedBudget || 15000,
    updatedBudget,
    budgetSaved: Math.abs(budgetAdjustment),
    modifiedItinerary,
    appliedAt: new Date().toISOString()
  };
};
