export const TRAVEL_PACKAGES_DATA = [
  {
    id: "pkg-goa-1",
    title: "2 Days Goa Explorer & Coastal Cruise",
    slug: "2-days-goa-explorer",
    destination: "Goa",
    state: "Goa",
    durationDays: 2,
    durationNights: 1,
    price: 4999,
    originalPrice: 7500,
    rating: 4.8,
    reviewsCount: 340,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    placesCovered: ["Calangute Beach", "Fort Aguada", "Mandovi River Cruise", "Anjuna Flea Market"],
    hotel: { name: "Seaside Heritage Resort", type: "4-Star Luxury Beach Resort", rating: 4.8 },
    activities: ["Sunset Mandovi River Cruise", "Water Sports at Baga", "Old Goa Church Tour"],
    transportIncluded: "Private AC Cab for all 2 Days",
    rewardPointsEarnable: 500,
    tags: ["Beach", "Heritage", "Nightlife"],
    isPopular: true
  },
  {
    id: "pkg-goa-2",
    title: "3 Days Beach & Heritage Grand Goa",
    slug: "3-days-beach-heritage-goa",
    destination: "Goa",
    state: "Goa",
    durationDays: 3,
    durationNights: 2,
    price: 7999,
    originalPrice: 11200,
    rating: 4.9,
    reviewsCount: 520,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    placesCovered: ["Basilica of Bom Jesus", "Palolem Beach", "Dudhsagar Waterfalls", "Fontainhas Latin Quarter"],
    hotel: { name: "Taj Exotica Partner Villa", type: "5-Star Premium Villa", rating: 4.9 },
    activities: ["Dudhsagar Jeep Safari", "Spice Plantation Lunch", "Portuguese Heritage Walk"],
    transportIncluded: "Chauffeur Driven AC Sedan",
    rewardPointsEarnable: 750,
    tags: ["Best Value", "Nature", "Luxury"],
    isPopular: true
  },
  {
    id: "pkg-goa-3",
    title: "4 Days Premium Goa Luxury Escape",
    slug: "4-days-premium-goa",
    destination: "Goa",
    state: "Goa",
    durationDays: 4,
    durationNights: 3,
    price: 12499,
    originalPrice: 18000,
    rating: 4.95,
    reviewsCount: 280,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    placesCovered: ["Morjim Beach", "Chapora Fort", "Divar Island", "Candolim Private Yacht"],
    hotel: { name: "Grand Hyatt Goa Partner", type: "5-Star Ultra Luxury", rating: 5.0 },
    activities: ["Private Catamaran Sunset Cruise", "Casino VIP Pass", "Ayurvedic Spa Session"],
    transportIncluded: "Private Luxury SUV",
    rewardPointsEarnable: 1250,
    tags: ["Luxury", "VIP", "Couples"],
    isPopular: false
  },
  {
    id: "pkg-kodai-1",
    title: "3 Days Kodaikanal Princess of Hills",
    slug: "3-days-kodaikanal-hills",
    destination: "Kodaikanal",
    state: "Tamil Nadu",
    durationDays: 3,
    durationNights: 2,
    price: 6499,
    originalPrice: 9000,
    rating: 4.85,
    reviewsCount: 410,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    placesCovered: ["Kodai Lake", "Pillar Rocks", "Coaker's Walk", "Pine Forest", "Berijam Lake"],
    hotel: { name: "The Carlton Lakefront", type: "Heritage 5-Star Hill Resort", rating: 4.8 },
    activities: ["Boating on Kodai Lake", "Forest Trek", "Campfire & Barbecue"],
    transportIncluded: "Private Mountain 4x4 Cab",
    rewardPointsEarnable: 650,
    tags: ["Hills", "Romantic", "Misty Weather"],
    isPopular: true
  },
  {
    id: "pkg-ladakh-1",
    title: "4 Days Leh Ladakh High Altitude Circuit",
    slug: "4-days-leh-ladakh-circuit",
    destination: "Leh Ladakh",
    state: "Ladakh",
    durationDays: 4,
    durationNights: 3,
    price: 14999,
    originalPrice: 21000,
    rating: 4.95,
    reviewsCount: 680,
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
    placesCovered: ["Shanti Stupa", "Khardung La Pass", "Nubra Valley", "Pangong Tso Lake"],
    hotel: { name: "Nubra Wooden Yurts & Leh Grand", type: "Eco-Luxury Camps & 4-Star Hotel", rating: 4.9 },
    activities: ["Double-Humped Camel Safari", "Star Gazing at Pangong", "Monastery Meditation"],
    transportIncluded: "Toyota Innova Crysta 4x4",
    rewardPointsEarnable: 1500,
    tags: ["Adventure", "High Altitude", "Bucket List"],
    isPopular: true
  },
  {
    id: "pkg-munnar-1",
    title: "3 Days Munnar Tea & Spice Trails",
    slug: "3-days-munnar-tea-spice",
    destination: "Munnar",
    state: "Kerala",
    durationDays: 3,
    durationNights: 2,
    price: 6899,
    originalPrice: 9500,
    rating: 4.8,
    reviewsCount: 390,
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
    placesCovered: ["Mattupetty Dam", "Kolukkumalai Tea Estate", "Eravikulam National Park", "Top Station"],
    hotel: { name: "Fragrant Nature Resort", type: "4-Star Valley View Resort", rating: 4.8 },
    activities: ["Tea Tasting Session", "Nilgiri Tahr Spotting", "Sunrise 4x4 Safari"],
    transportIncluded: "Private AC Chauffeur Cab",
    rewardPointsEarnable: 700,
    tags: ["Tea Gardens", "Nature", "Waterfalls"],
    isPopular: true
  }
];

export const getPackagesForDestination = (destinationName = "Goa") => {
  if (!destinationName) return TRAVEL_PACKAGES_DATA.slice(0, 3);
  const clean = destinationName.toLowerCase();
  const matched = TRAVEL_PACKAGES_DATA.filter((p) =>
    p.destination.toLowerCase().includes(clean) ||
    clean.includes(p.destination.toLowerCase())
  );
  return matched.length > 0 ? matched : TRAVEL_PACKAGES_DATA.slice(0, 3);
};

export const travelPackages = TRAVEL_PACKAGES_DATA;

