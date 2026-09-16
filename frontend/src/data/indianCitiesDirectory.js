import { destinationsData, getAllStates } from "./destinationsData";

// Comprehensive verified list of Indian Cities, Metros, District Hubs & Tourist Destinations
export const VERIFIED_INDIAN_CITIES = [
  // Metros & Major Airport Hubs
  { name: "Chennai", state: "Tamil Nadu", code: "MAA", isMetro: true },
  { name: "Delhi", state: "Delhi", code: "DEL", isMetro: true },
  { name: "New Delhi", state: "Delhi", code: "DEL", isMetro: true },
  { name: "Mumbai", state: "Maharashtra", code: "BOM", isMetro: true },
  { name: "Bengaluru", state: "Karnataka", code: "BLR", isMetro: true },
  { name: "Bangalore", state: "Karnataka", code: "BLR", isMetro: true },
  { name: "Kolkata", state: "West Bengal", code: "CCU", isMetro: true },
  { name: "Hyderabad", state: "Telangana", code: "HYD", isMetro: true },
  { name: "Ahmedabad", state: "Gujarat", code: "AMD", isMetro: true },
  { name: "Pune", state: "Maharashtra", code: "PNQ", isMetro: true },
  { name: "Kochi", state: "Kerala", code: "COK", isMetro: true },
  { name: "Cochin", state: "Kerala", code: "COK", isMetro: true },
  { name: "Chandigarh", state: "Punjab", code: "IXC", isMetro: true },
  { name: "Jaipur", state: "Rajasthan", code: "JAI", isMetro: true },
  { name: "Lucknow", state: "Uttar Pradesh", code: "LKO", isMetro: true },
  { name: "Goa", state: "Goa", code: "GOI", isMetro: true },
  { name: "Panaji", state: "Goa", code: "GOI", isMetro: true },
  { name: "Varanasi", state: "Uttar Pradesh", code: "VNS", isMetro: true },
  { name: "Bhubaneswar", state: "Odisha", code: "BBI", isMetro: true },
  { name: "Guwahati", state: "Assam", code: "GAU", isMetro: true },
  { name: "Patna", state: "Bihar", code: "PAT", isMetro: true },
  { name: "Ranchi", state: "Jharkhand", code: "IXR", isMetro: true },
  { name: "Indore", state: "Madhya Pradesh", code: "IDR", isMetro: true },
  { name: "Bhopal", state: "Madhya Pradesh", code: "BHO", isMetro: true },
  { name: "Nagpur", state: "Maharashtra", code: "NAG", isMetro: true },
  { name: "Srinagar", state: "Jammu & Kashmir", code: "SXR", isMetro: true },
  { name: "Jammu", state: "Jammu & Kashmir", code: "IXJ", isMetro: true },
  { name: "Leh", state: "Ladakh", code: "IXL", isMetro: true },
  { name: "Ladakh", state: "Ladakh", code: "IXL", isMetro: true },
  { name: "Amritsar", state: "Punjab", code: "ATQ", isMetro: true },
  { name: "Coimbatore", state: "Tamil Nadu", code: "CJB", isMetro: true },
  { name: "Madurai", state: "Tamil Nadu", code: "IXM", isMetro: true },
  { name: "Thiruvananthapuram", state: "Kerala", code: "TRV", isMetro: true },
  { name: "Trivandrum", state: "Kerala", code: "TRV", isMetro: true },
  { name: "Kozhikode", state: "Kerala", code: "CCJ", isMetro: true },
  { name: "Calicut", state: "Kerala", code: "CCJ", isMetro: true },
  { name: "Mangalore", state: "Karnataka", code: "IXE", isMetro: true },
  { name: "Visakhapatnam", state: "Andhra Pradesh", code: "VTZ", isMetro: true },
  { name: "Vizag", state: "Andhra Pradesh", code: "VTZ", isMetro: true },
  { name: "Vijayawada", state: "Andhra Pradesh", code: "VGA", isMetro: true },
  { name: "Tirupati", state: "Andhra Pradesh", code: "TIR", isMetro: true },
  { name: "Dehradun", state: "Uttarakhand", code: "DED", isMetro: true },
  { name: "Rishikesh", state: "Uttarakhand", code: "RSH", isMetro: false },
  { name: "Haridwar", state: "Uttarakhand", code: "HW", isMetro: false },
  { name: "Shimla", state: "Himachal Pradesh", code: "SLV", isMetro: true },
  { name: "Manali", state: "Himachal Pradesh", code: "KUU", isMetro: false },
  { name: "Dharamshala", state: "Himachal Pradesh", code: "DHM", isMetro: true },
  { name: "Agra", state: "Uttar Pradesh", code: "AGR", isMetro: true },
  { name: "Mathura", state: "Uttar Pradesh", code: "MTJ", isMetro: false },
  { name: "Ayodhya", state: "Uttar Pradesh", code: "AY", isMetro: true },
  { name: "Prayagraj", state: "Uttar Pradesh", code: "PRG", isMetro: true },
  { name: "Allahabad", state: "Uttar Pradesh", code: "PRG", isMetro: true },
  { name: "Udaipur", state: "Rajasthan", code: "UDR", isMetro: true },
  { name: "Jodhpur", state: "Rajasthan", code: "JDH", isMetro: true },
  { name: "Jaisalmer", state: "Rajasthan", code: "JSA", isMetro: true },
  { name: "Bikaner", state: "Rajasthan", code: "BKB", isMetro: false },
  { name: "Pushkar", state: "Rajasthan", code: "PUS", isMetro: false },
  { name: "Ajmer", state: "Rajasthan", code: "AII", isMetro: false },
  { name: "Mount Abu", state: "Rajasthan", code: "MAB", isMetro: false },
  { name: "Kodaikanal", state: "Tamil Nadu", code: "KOD", isMetro: false },
  { name: "Ooty", state: "Tamil Nadu", code: "UAM", isMetro: false },
  { name: "Udhagamandalam", state: "Tamil Nadu", code: "UAM", isMetro: false },
  { name: "Munnar", state: "Kerala", code: "MNR", isMetro: false },
  { name: "Alleppey", state: "Kerala", code: "ALP", isMetro: false },
  { name: "Alappuzha", state: "Kerala", code: "ALP", isMetro: false },
  { name: "Wayanad", state: "Kerala", code: "WYD", isMetro: false },
  { name: "Varkala", state: "Kerala", code: "VRK", isMetro: false },
  { name: "Thekkady", state: "Kerala", code: "TKD", isMetro: false },
  { name: "Hampi", state: "Karnataka", code: "HMP", isMetro: false },
  { name: "Mysore", state: "Karnataka", code: "MYQ", isMetro: true },
  { name: "Mysuru", state: "Karnataka", code: "MYQ", isMetro: true },
  { name: "Gokarna", state: "Karnataka", code: "GOK", isMetro: false },
  { name: "Coorg", state: "Karnataka", code: "CRG", isMetro: false },
  { name: "Madikeri", state: "Karnataka", code: "MDK", isMetro: false },
  { name: "Chikmagalur", state: "Karnataka", code: "CKM", isMetro: false },
  { name: "Rameswaram", state: "Tamil Nadu", code: "RMM", isMetro: false },
  { name: "Kanyakumari", state: "Tamil Nadu", code: "CAPE", isMetro: false },
  { name: "Thanjavur", state: "Tamil Nadu", code: "TJ", isMetro: false },
  { name: "Tiruchirappalli", state: "Tamil Nadu", code: "TRZ", isMetro: true },
  { name: "Trichy", state: "Tamil Nadu", code: "TRZ", isMetro: true },
  { name: "Pondicherry", state: "Puducherry", code: "PNY", isMetro: true },
  { name: "Puducherry", state: "Puducherry", code: "PNY", isMetro: true },
  { name: "Mahabalipuram", state: "Tamil Nadu", code: "MBP", isMetro: false },
  { name: "Yercaud", state: "Tamil Nadu", code: "YCD", isMetro: false },
  { name: "Yelagiri", state: "Tamil Nadu", code: "YLG", isMetro: false },
  { name: "Valparai", state: "Tamil Nadu", code: "VLP", isMetro: false },
  { name: "Darjeeling", state: "West Bengal", code: "DAJ", isMetro: false },
  { name: "Kalimpong", state: "West Bengal", code: "KMP", isMetro: false },
  { name: "Siliguri", state: "West Bengal", code: "IXB", isMetro: true },
  { name: "Gangtok", state: "Sikkim", code: "PYG", isMetro: true },
  { name: "Pelling", state: "Sikkim", code: "PLG", isMetro: false },
  { name: "Shillong", state: "Meghalaya", code: "SHL", isMetro: true },
  { name: "Cherrapunji", state: "Meghalaya", code: "CHRP", isMetro: false },
  { name: "Tawang", state: "Arunachal Pradesh", code: "TWG", isMetro: false },
  { name: "Itanagar", state: "Arunachal Pradesh", code: "HGI", isMetro: true },
  { name: "Kaziranga", state: "Assam", code: "KZR", isMetro: false },
  { name: "Puri", state: "Odisha", code: "PURI", isMetro: false },
  { name: "Konark", state: "Odisha", code: "KNK", isMetro: false },
  { name: "Khajuraho", state: "Madhya Pradesh", code: "HJR", isMetro: false },
  { name: "Gwalior", state: "Madhya Pradesh", code: "GWL", isMetro: true },
  { name: "Ujjain", state: "Madhya Pradesh", code: "UJN", isMetro: false },
  { name: "Pachmarhi", state: "Madhya Pradesh", code: "PMH", isMetro: false },
  { name: "Spiti", state: "Himachal Pradesh", code: "SPI", isMetro: false },
  { name: "Kaza", state: "Himachal Pradesh", code: "KAZ", isMetro: false },
  { name: "Kasol", state: "Himachal Pradesh", code: "KSL", isMetro: false },
  { name: "Kullu", state: "Himachal Pradesh", code: "KUU", isMetro: true },
  { name: "Kedarnath", state: "Uttarakhand", code: "KED", isMetro: false },
  { name: "Badrinath", state: "Uttarakhand", code: "BAD", isMetro: false },
  { name: "Nainital", state: "Uttarakhand", code: "NNT", isMetro: false },
  { name: "Mussoorie", state: "Uttarakhand", code: "MSS", isMetro: false },
  { name: "Auli", state: "Uttarakhand", code: "AUL", isMetro: false },
  { name: "Jim Corbett", state: "Uttarakhand", code: "JCR", isMetro: false },
  { name: "Somnath", state: "Gujarat", code: "SMN", isMetro: false },
  { name: "Dwarka", state: "Gujarat", code: "DWK", isMetro: false },
  { name: "Kutch", state: "Gujarat", code: "BHJ", isMetro: false },
  { name: "Rann of Kutch", state: "Gujarat", code: "RNK", isMetro: false },
  { name: "Gir", state: "Gujarat", code: "GIR", isMetro: false },
  { name: "Surat", state: "Gujarat", code: "STV", isMetro: true },
  { name: "Vadodara", state: "Gujarat", code: "BDQ", isMetro: true },
  { name: "Rajkot", state: "Gujarat", code: "RAJ", isMetro: true },
  { name: "Nashik", state: "Maharashtra", code: "ISK", isMetro: true },
  { name: "Aurangabad", state: "Maharashtra", code: "IXU", isMetro: true },
  { name: "Chhatrapati Sambhajinagar", state: "Maharashtra", code: "IXU", isMetro: true },
  { name: "Shirdi", state: "Maharashtra", code: "SAG", isMetro: true },
  { name: "Mahabaleshwar", state: "Maharashtra", code: "MHB", isMetro: false },
  { name: "Lonavala", state: "Maharashtra", code: "LNV", isMetro: false },
  { name: "Khandala", state: "Maharashtra", code: "KHD", isMetro: false },
  { name: "Alibaug", state: "Maharashtra", code: "ABG", isMetro: false },
  { name: "Port Blair", state: "Andaman & Nicobar", code: "IXZ", isMetro: true },
  { name: "Havelock", state: "Andaman & Nicobar", code: "HVK", isMetro: false },
  { name: "Swaraj Dweep", state: "Andaman & Nicobar", code: "HVK", isMetro: false },
  { name: "Neil Island", state: "Andaman & Nicobar", code: "NLS", isMetro: false },
  { name: "Shaheed Dweep", state: "Andaman & Nicobar", code: "NLS", isMetro: false },
  { name: "Agatti", state: "Lakshadweep", code: "AGX", isMetro: true },
  { name: "Kavaratti", state: "Lakshadweep", code: "KVT", isMetro: false }
];

// Dynamically augment with all destination names and districts from destinationsData
destinationsData.forEach((d) => {
  if (!VERIFIED_INDIAN_CITIES.some((c) => c.name.toLowerCase() === d.name.toLowerCase())) {
    VERIFIED_INDIAN_CITIES.push({
      name: d.name,
      state: d.state,
      code: d.district ? d.district.slice(0, 3).toUpperCase() : "IND",
      isMetro: false
    });
  }
  if (!VERIFIED_INDIAN_CITIES.some((c) => c.name.toLowerCase() === d.district.toLowerCase())) {
    VERIFIED_INDIAN_CITIES.push({
      name: d.district,
      state: d.state,
      code: d.district.slice(0, 3).toUpperCase(),
      isMetro: false
    });
  }
});

/**
 * Strict City Verification Utility
 * Checks if a user's input matches a valid Indian city / destination.
 * If invalid, provides close phonetic or substring suggestions.
 */
export const verifyIndianCity = (inputCity) => {
  if (!inputCity || typeof inputCity !== "string" || !inputCity.trim()) {
    return {
      isValid: false,
      message: "Please enter a valid city name.",
      suggestions: ["Chennai", "Delhi", "Mumbai", "Bengaluru", "Kodaikanal"]
    };
  }

  const clean = inputCity.trim().toLowerCase().replace(/\s*\(.*?\)\s*/g, "");

  // Exact or normalized match
  const match = VERIFIED_INDIAN_CITIES.find(
    (c) =>
      c.name.toLowerCase() === clean ||
      c.name.toLowerCase().includes(clean) ||
      clean.includes(c.name.toLowerCase()) ||
      (c.code && c.code.toLowerCase() === clean)
  );

  if (match) {
    return {
      isValid: true,
      city: match.name,
      state: match.state,
      code: match.code,
      fullName: `${match.name}, ${match.state}`
    };
  }

  // Calculate suggestions based on partial match or first letters
  const suggestions = VERIFIED_INDIAN_CITIES.filter((c) => {
    const cLower = c.name.toLowerCase();
    return (
      cLower.startsWith(clean.slice(0, 2)) ||
      cLower.startsWith(clean.slice(0, 3)) ||
      cLower.includes(clean.slice(0, 2))
    );
  })
    .slice(0, 4)
    .map((c) => c.name);

  const fallbackSuggestions = suggestions.length > 0
    ? suggestions
    : ["Kodaikanal", "Leh Ladakh", "Munnar", "Varanasi", "Goa", "Jaipur"];

  return {
    isValid: false,
    message: `"${inputCity}" is not a recognized Indian city or destination. Please enter a valid city.`,
    suggestions: fallbackSuggestions
  };
};

/**
 * Search autocomplete suggestions
 */
export const getCitySuggestions = (query) => {
  if (!query || query.trim().length < 1) return [];
  const q = query.trim().toLowerCase();
  return VERIFIED_INDIAN_CITIES.filter((c) =>
    c.name.toLowerCase().includes(q) ||
    c.state.toLowerCase().includes(q) ||
    (c.code && c.code.toLowerCase().includes(q))
  ).slice(0, 6);
};
