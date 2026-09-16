// DestinationService.js — Hierarchical Destination Retrieval & Metadata Helper

import { destinationsData, getAllStates, getDistrictsByState } from "../data/destinationsData";
import { ALL_INDIAN_STATES_DIRECTORY } from "../data/stateCapitalsAndDistricts";

export class DestinationService {
  static getAllDestinations() {
    return destinationsData;
  }

  static getPopularDestinations(limit = 6) {
    return [...destinationsData]
      .sort((a, b) => (b.rating * b.reviewsCount) - (a.rating * a.reviewsCount))
      .slice(0, limit);
  }

  static getNearbyDestinations(currentDestinationName, limit = 4) {
    const targetName = (typeof currentDestinationName === 'string' ? currentDestinationName : currentDestinationName?.name || '').toLowerCase();
    const current = destinationsData.find(
      (d) => (d.name || '').toLowerCase() === targetName
    );
    if (!current) return destinationsData.slice(0, limit);

    return destinationsData
      .filter((d) => d.id !== current.id && (d.state === current.state || d.region === current.region))
      .slice(0, limit);
  }

  /**
   * Hierarchical lookup: State -> District -> City / Destination
   */
  static getHierarchicalData() {
    const states = getAllStates();
    const tree = {};

    states.forEach((state) => {
      const districts = getDistrictsByState(state);
      tree[state] = {};
      districts.forEach((dist) => {
        const dests = destinationsData.filter(
          (d) => (d.state || '').toLowerCase() === (state || '').toLowerCase() && (d.district || '').toLowerCase() === (dist || '').toLowerCase()
        );
        tree[state][dist] = dests;
      });
    });

    return tree;
  }

  /**
   * Get weather overview estimate for a given destination
   */
  static getWeatherEstimate(destinationName = "") {
    const name = (typeof destinationName === 'string' ? destinationName : destinationName?.name || '').toLowerCase();
    if (name.includes("leh") || name.includes("ladakh") || name.includes("spiti")) {
      return { temp: "8°C – 16°C", condition: "Chilly & Clear Mountain Air", icon: "Snowflake", advisory: "Cold evenings, warm layers required" };
    }
    if (name.includes("manali") || name.includes("shimla") || name.includes("ooty") || name.includes("kodai") || name.includes("munnar")) {
      return { temp: "14°C – 22°C", condition: "Pleasant Hill Station Breeze", icon: "CloudSun", advisory: "Light jacket recommended in evening" };
    }
    if (name.includes("goa") || name.includes("varkala") || name.includes("gokarna") || name.includes("puri")) {
      return { temp: "26°C – 32°C", condition: "Sunny Coastal Warmth", icon: "Sun", advisory: "Sunscreen and beachwear ideal" };
    }
    return { temp: "22°C – 29°C", condition: "Clear & Pleasant", icon: "Sun", advisory: "Great conditions for city exploration" };
  }
}

