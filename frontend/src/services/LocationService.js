// LocationService.js — Smart Location Resolution & Privacy Management
import { VERIFIED_INDIAN_CITIES } from "../data/indianCitiesDirectory";
import { ALL_INDIAN_STATES_DIRECTORY, getCapitalForState, getAllDistrictsForState } from "../data/stateCapitalsAndDistricts";
import { destinationsData, getAllStates, getDistrictsByState } from "../data/destinationsData";

class LocationService {
  constructor() {
    this.cachedLocation = null;
    this.isGeolocationEnabled = false;
    this.privacyStatus = "Location: Off (Using manual selection)";
  }

  // Get all supported states in India
  getStates() {
    return ALL_INDIAN_STATES_DIRECTORY.map((s) => ({
      state: s.state,
      capital: s.capital,
      description: s.capitalDescription,
      image: s.capitalImage,
      districtCount: s.keyDistricts?.length || 0,
      districts: s.keyDistricts || []
    }));
  }

  // Get districts for a given state
  getDistricts(stateName) {
    if (!stateName || stateName === "All") {
      return getDistrictsByState("All");
    }
    const stateObj = ALL_INDIAN_STATES_DIRECTORY.find(
      (s) => s.state.toLowerCase() === stateName.trim().toLowerCase()
    );
    if (stateObj && stateObj.keyDistricts) {
      return stateObj.keyDistricts;
    }
    return getDistrictsByState(stateName);
  }

  // Get cities / destinations in a given state & district
  getDestinations(stateName, districtName) {
    let filtered = destinationsData;
    if (stateName && stateName !== "All") {
      filtered = filtered.filter(
        (d) => d.state.toLowerCase() === stateName.trim().toLowerCase()
      );
    }
    if (districtName && districtName !== "All") {
      filtered = filtered.filter(
        (d) => d.district.toLowerCase().includes(districtName.trim().toLowerCase())
      );
    }
    return filtered;
  }

  // Search origin or destination by query text
  searchLocations(query) {
    if (!query || query.trim().length < 2) return [];
    const q = query.toLowerCase().trim();

    const cityMatches = VERIFIED_INDIAN_CITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
    ).map((c) => ({
      id: `city-${c.name}-${c.state}`,
      name: c.name,
      state: c.state,
      type: c.isMetro ? "Major Metro / Hub" : "City Hub",
      code: c.code || "",
      isMetro: !!c.isMetro
    }));

    const destMatches = destinationsData.filter(
      (d) => d.name.toLowerCase().includes(q) || d.district.toLowerCase().includes(q)
    ).map((d) => ({
      id: d.id,
      name: d.name,
      state: d.state,
      district: d.district,
      type: "Tourist Destination",
      category: d.category,
      image: d.images?.[0] || null
    }));

    return [...cityMatches, ...destMatches].slice(0, 10);
  }

  // Explicit opt-in geolocation with privacy respect
  async requestUserLocation() {
    if (!navigator.geolocation) {
      this.privacyStatus = "Location unsupported by browser";
      return { success: false, message: "Geolocation not supported" };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.isGeolocationEnabled = true;
          this.cachedLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          this.privacyStatus = "Using My Location (Precise)";
          resolve({
            success: true,
            location: this.cachedLocation,
            status: this.privacyStatus
          });
        },
        (error) => {
          this.isGeolocationEnabled = false;
          this.privacyStatus = "Location: Off (Permission Denied)";
          resolve({
            success: false,
            message: error.message,
            status: this.privacyStatus
          });
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  disableLocation() {
    this.isGeolocationEnabled = false;
    this.cachedLocation = null;
    this.privacyStatus = "Location: Off (Using selected location)";
    return this.privacyStatus;
  }

  getPrivacyStatus() {
    return this.privacyStatus;
  }

  // Find nearest transport terminals for sudden travel or first-mile planning
  getNearestTerminals(originName) {
    const origin = (originName || "Chennai").toLowerCase();

    // Context-aware terminal hubs
    if (origin.includes("chennai")) {
      return {
        railway: [
          { name: "Chennai Central (MAS)", distanceKm: 8.5, travelTimeMins: 25, type: "Major Terminal" },
          { name: "Chennai Egmore (MS)", distanceKm: 7.2, travelTimeMins: 20, type: "Southbound Hub" },
          { name: "Tambaram (TBM)", distanceKm: 22.0, travelTimeMins: 45, type: "Suburban Junction" }
        ],
        bus: [
          { name: "Puratchi Thalaivar Dr. MGR Bus Terminus (CMBT)", distanceKm: 11.0, travelTimeMins: 35, type: "Interstate Bus Hub" },
          { name: "Kilambakkam Bus Terminus (KCBT)", distanceKm: 28.0, travelTimeMins: 55, type: "South Bound Mofussil" }
        ],
        airport: [
          { name: "Chennai International Airport (MAA)", distanceKm: 14.5, travelTimeMins: 40, type: "International Terminal" }
        ],
        metro: [
          { name: "Nearest Metro Station (Blue/Green Line)", distanceKm: 1.5, travelTimeMins: 8, type: "Rapid Transit" }
        ]
      };
    }

    if (origin.includes("delhi") || origin.includes("new delhi")) {
      return {
        railway: [
          { name: "New Delhi Railway Station (NDLS)", distanceKm: 6.0, travelTimeMins: 20, type: "Primary Rail Hub" },
          { name: "Old Delhi Railway Station (DLI)", distanceKm: 8.5, travelTimeMins: 28, type: "Heritage Junction" },
          { name: "Hazrat Nizamuddin (NZM)", distanceKm: 9.0, travelTimeMins: 30, type: "Rajdhani/South Hub" },
          { name: "Anand Vihar Terminal (ANVT)", distanceKm: 15.0, travelTimeMins: 45, type: "East Bound Terminal" }
        ],
        bus: [
          { name: "Kashmere Gate ISBT", distanceKm: 9.0, travelTimeMins: 30, type: "North Bus Terminal" },
          { name: "Sarai Kale Khan ISBT", distanceKm: 10.5, travelTimeMins: 35, type: "Central ISBT" },
          { name: "Anand Vihar ISBT", distanceKm: 14.0, travelTimeMins: 42, type: "East ISBT" }
        ],
        airport: [
          { name: "Indira Gandhi International Airport (DEL T3/T1)", distanceKm: 18.0, travelTimeMins: 45, type: "Hub Airport" }
        ],
        metro: [
          { name: "Airport Express Line Station", distanceKm: 2.0, travelTimeMins: 8, type: "Superfast Metro" }
        ]
      };
    }

    if (origin.includes("bengaluru") || origin.includes("bangalore")) {
      return {
        railway: [
          { name: "KSR Bengaluru City Junction (SBC)", distanceKm: 7.0, travelTimeMins: 25, type: "Majestic Main Hub" },
          { name: "Yesvantpur Junction (YPR)", distanceKm: 12.0, travelTimeMins: 35, type: "North/West Terminal" },
          { name: "SMVT Sir M Visvesvaraya Terminal (Baiyappanahalli)", distanceKm: 14.0, travelTimeMins: 40, type: "Modern AC Terminal" }
        ],
        bus: [
          { name: "Kempegowda Bus Station (Majestic)", distanceKm: 7.2, travelTimeMins: 25, type: "KSRTC Main Terminal" },
          { name: "Shantinagar Bus Station", distanceKm: 5.5, travelTimeMins: 20, type: "TN/Kerala Interstate Hub" },
          { name: "Satellite Bus Station (Mysore Road)", distanceKm: 11.0, travelTimeMins: 35, type: "Mysuru/Ooty Hub" }
        ],
        airport: [
          { name: "Kempegowda International Airport (BLR)", distanceKm: 34.0, travelTimeMins: 65, type: "International Hub" }
        ],
        metro: [
          { name: "Namma Metro Station (Purple/Green Line)", distanceKm: 1.2, travelTimeMins: 6, type: "Metro Feeder" }
        ]
      };
    }

    if (origin.includes("mumbai")) {
      return {
        railway: [
          { name: "Chhatrapati Shivaji Maharaj Terminus (CSMT)", distanceKm: 8.0, travelTimeMins: 30, type: "Central Hub" },
          { name: "Mumbai Central (MMCT)", distanceKm: 6.5, travelTimeMins: 25, type: "Western Rail Terminal" },
          { name: "Bandra Terminus (BDTS)", distanceKm: 14.0, travelTimeMins: 40, type: "Northbound Hub" },
          { name: "Lokmanya Tilak Terminus (LTT)", distanceKm: 18.0, travelTimeMins: 50, type: "Central/South Hub" }
        ],
        bus: [
          { name: "Mumbai Central MSRTC Stand", distanceKm: 6.5, travelTimeMins: 25, type: "Shivneri AC Hub" },
          { name: "Borivali West MSRTC Pickup", distanceKm: 28.0, travelTimeMins: 60, type: "Gujarat/Northbound Bus" }
        ],
        airport: [
          { name: "Chhatrapati Shivaji Maharaj Airport (BOM T2/T1)", distanceKm: 16.0, travelTimeMins: 45, type: "International/Domestic" }
        ],
        metro: [
          { name: "Mumbai Metro Station", distanceKm: 1.0, travelTimeMins: 5, type: "Metro Link" }
        ]
      };
    }

    // Default regional hub template
    return {
      railway: [
        { name: `${originName} Junction Railway Station`, distanceKm: 5.5, travelTimeMins: 20, type: "Main Railway Junction" }
      ],
      bus: [
        { name: `${originName} Central Bus Stand`, distanceKm: 4.2, travelTimeMins: 15, type: "State RTC Main Stand" }
      ],
      airport: [
        { name: `Nearest Domestic Airport (${originName} Region)`, distanceKm: 25.0, travelTimeMins: 50, type: "Regional Airport" }
      ],
      metro: [
        { name: "Local Public Transit Point", distanceKm: 0.8, travelTimeMins: 4, type: "Local Transit" }
      ]
    };
  }
}

export const locationService = new LocationService();
