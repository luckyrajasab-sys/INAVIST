// Seed Data for INAVIST Backend Database

export const seedHotels = [
  // --- Tamil Nadu ---
  {
    id: "ht-tn-1",
    name: "The Carlton Luxury Lake Resort",
    state: "Tamil Nadu",
    district: "Dindigul",
    city: "Kodaikanal",
    area: "Lake Road / Coaker's Walk",
    category: "Luxury",
    type: "Resort",
    rating: 4.9,
    reviewsCount: 3200,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "5-star luxury heritage resort situated right on the banks of Kodaikanal Lake with private pedal boats, golf green, and mountain view colonial hearths.",
    basePrice: 7800,
    taxes: 1404,
    discount: 800,
    amenities: ["Private Lake View Balcony", "Heated Indoor Hearth", "Spa & Wellness Center", "Golf Course Access", "Buffet Breakfast Included", "Free High-Speed Wi-Fi"],
    rooms: [
      { type: "Deluxe Lake Facing Room", price: 7800, available: 6 },
      { type: "Royal Colonial Suite", price: 14500, available: 2 }
    ]
  },
  {
    id: "ht-tn-2",
    name: "Savoy - IHCL SeleQtions (Heritage)",
    state: "Tamil Nadu",
    district: "Nilgiris",
    city: "Ooty (Udhagamandalam)",
    area: "Sylks Road / Charing Cross",
    category: "Luxury",
    type: "Hotel",
    rating: 4.92,
    reviewsCount: 2450,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "190-year-old historic colonial estate spread over 6 rolling acres of English gardens with crackling log fires and afternoon high tea.",
    basePrice: 8500,
    taxes: 1530,
    discount: 750,
    amenities: ["Fireplace in Every Room", "English Rose Garden Lounge", "Ayurvedic Treatments", "Gourmet Dining", "Billiards Room"],
    rooms: [
      { type: "Superior Garden Room", price: 8500, available: 4 },
      { type: "Heritage Cottage with Hearth", price: 16000, available: 2 }
    ]
  },
  {
    id: "ht-tn-3",
    name: "Taj Connemara Heritage Hotel",
    state: "Tamil Nadu",
    district: "Chennai",
    city: "Chennai",
    area: "Binny Road, Nungambakkam",
    category: "Luxury",
    type: "Hotel",
    rating: 4.85,
    reviewsCount: 4100,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Chennai's only heritage hotel dating back to 1854, blending art deco architecture with modern coastal luxury in the heart of the city.",
    basePrice: 6200,
    taxes: 1116,
    discount: 500,
    amenities: ["Outdoor Swimming Pool", "Jiva Spa", "Chettinad Specialty Restaurant", "Concierge Chauffeur", "Gym & Fitness"],
    rooms: [
      { type: "Heritage Classic Room", price: 6200, available: 8 },
      { type: "Executive Suite", price: 11000, available: 3 }
    ]
  },

  // --- Kerala ---
  {
    id: "ht-kl-1",
    name: "Spice Tree Munnar Valley Nature Retreat",
    state: "Kerala",
    district: "Idukki",
    city: "Munnar",
    area: "Muttukad, Chinnakanal",
    category: "Luxury",
    type: "Resort",
    rating: 4.95,
    reviewsCount: 2890,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Secluded eco-luxury boutique resort set amidst tea plantations, spice groves, and panoramic valley mist of the Western Ghats.",
    basePrice: 6800,
    taxes: 1224,
    discount: 600,
    amenities: ["Infinity Pool overlooking Valley", "Organic Plantation Walks", "Ayurvedic Spa & Steam", "Jacuzzi Suites", "Farm-to-Table Dining"],
    rooms: [
      { type: "Classic Valley View Suite", price: 6800, available: 5 },
      { type: "Private Pool Villa with Plunge", price: 14000, available: 2 }
    ]
  },
  {
    id: "ht-kl-2",
    name: "Lake Palace Backwater Resort",
    state: "Kerala",
    district: "Alappuzha",
    city: "Alleppey",
    area: "Punnamada Lake Backwaters",
    category: "Luxury",
    type: "Resort",
    rating: 4.88,
    reviewsCount: 3120,
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Private island resort surrounded on all sides by the tranquil Vembanad waters with water villas and private shikara boat transfers.",
    basePrice: 7200,
    taxes: 1296,
    discount: 700,
    amenities: ["Water Villa Over Lake", "Private Shikara Cruises", "Ayurvedic Wellness Spa", "Fresh Kuttanad Fish Specialties", "Floating Restaurant"],
    rooms: [
      { type: "Waterfront Luxury Cottage", price: 7200, available: 4 },
      { type: "Lake View Pool Villa", price: 13500, available: 2 }
    ]
  },
  {
    id: "ht-kl-3",
    name: "Brunton Boatyard (CGH Earth)",
    state: "Kerala",
    district: "Ernakulam",
    city: "Kochi (Cochin)",
    area: "Calvathy Road, Fort Kochi",
    category: "Mid-Range",
    type: "Hotel",
    rating: 4.89,
    reviewsCount: 2200,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Restored Victorian shipbuilding yard located on the harbor mouth with rooms overlooking dolphin sightings and historic Chinese fishing nets.",
    basePrice: 5900,
    taxes: 1062,
    discount: 500,
    amenities: ["Harbor Sea View Rooms", "Seafood Grill on Pier", "Sunset Harbor Cruise Included", "Swimming Pool"],
    rooms: [
      { type: "Sea Facing Colonial Room", price: 5900, available: 5 }
    ]
  },

  // --- Karnataka ---
  {
    id: "ht-ka-1",
    name: "Zostel Hampi (Backpacker Haven)",
    state: "Karnataka",
    district: "Vijayanagara",
    city: "Hampi",
    area: "Sanapur Lake Road",
    category: "Budget",
    type: "Hostel",
    rating: 4.8,
    reviewsCount: 2850,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Vibrant bohemian backpacker hostel nestled among Hampi boulders and paddy fields with common room, cafe, and sunset viewpoints.",
    basePrice: 1200,
    taxes: 150,
    discount: 100,
    amenities: ["Dorm & Private Pods", "Cafe & Bakery", "Bicycle Rental", "Common Chill Lounge", "Bonfire Nights"],
    rooms: [
      { type: "6-Bed Mixed AC Dorm Bed", price: 1200, available: 12 },
      { type: "Private Garden Cottage", price: 2800, available: 3 }
    ]
  },
  {
    id: "ht-ka-2",
    name: "The Tamara Coorg (Luxury Rainforest Resort)",
    state: "Karnataka",
    district: "Kodagu",
    city: "Coorg (Madikeri)",
    area: "Yevakapadi, Kabbinakad Estate",
    category: "Luxury",
    type: "Resort",
    rating: 4.96,
    reviewsCount: 3800,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Elevated luxury wooden chalets built on stilts nestled inside 180 acres of organic coffee, cardamom, and pepper plantations in the Western Ghats.",
    basePrice: 11500,
    taxes: 2070,
    discount: 1000,
    amenities: ["Private Waterfall on Estate", "Coffee Brewing Sessions", "Elevated Deck Lounge", "Ayurvedic Forest Spa", "Bird Watching Trails"],
    rooms: [
      { type: "Luxury Stilted Chalet", price: 11500, available: 4 },
      { type: "Eden Lotus Villa with Jacuzzi", price: 22000, available: 1 }
    ]
  },

  // --- Goa ---
  {
    id: "ht-ga-1",
    name: "Taj Fort Aguada Beach Resort & Spa",
    state: "Goa",
    district: "North Goa",
    city: "Sinquerim / Candolim",
    area: "Sinquerim Beach Road",
    category: "Luxury",
    type: "Resort",
    rating: 4.93,
    reviewsCount: 5200,
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Goa's iconic 5-star beachfront resort built into the ramparts of a 16th-century Portuguese fortress overlooking the Arabian Sea.",
    basePrice: 9200,
    taxes: 1656,
    discount: 900,
    amenities: ["Direct Beach Access", "Clifftop Ocean Dining", "Jiva Spa Treatments", "Sea-facing Infinity Pool", "Water Sports Desk"],
    rooms: [
      { type: "Superior Sea View Room", price: 9200, available: 6 },
      { type: "Aguada Hermitage Villa", price: 24000, available: 2 }
    ]
  },
  {
    id: "ht-ga-2",
    name: "Santana Beach Resort",
    state: "Goa",
    district: "North Goa",
    city: "Calangute",
    area: "Calangute / Candolim Beach",
    category: "Mid-Range",
    type: "Hotel",
    rating: 4.75,
    reviewsCount: 2100,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Charming Portuguese-style hotel nestled among palm trees with two outdoor swimming pools and direct 2-minute walk to the golden sand beach.",
    basePrice: 3200,
    taxes: 384,
    discount: 300,
    amenities: ["2 Outdoor Pools", "Poolside Bar & Grill", "2 Min Walk to Beach", "Air Conditioned", "Free Wi-Fi"],
    rooms: [
      { type: "Deluxe Pool View Room", price: 3200, available: 8 }
    ]
  },

  // --- Rajasthan ---
  {
    id: "ht-rj-1",
    name: "Alsisar Haveli (Royal Rajput Heritage)",
    state: "Rajasthan",
    district: "Jaipur",
    city: "Jaipur",
    area: "Sansar Chandra Road, MI Road",
    category: "Luxury",
    type: "Hotel",
    rating: 4.88,
    reviewsCount: 3400,
    images: [
      "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Restored royal palace haveli featuring intricate fresco work, antique chandeliers, peaceful courtyard swimming pool, and puppet shows.",
    basePrice: 4900,
    taxes: 882,
    discount: 400,
    amenities: ["Heritage Courtyard Pool", "Traditional Puppet Show", "Fine Dining Sheesh Mahal", "Rooftop City View"],
    rooms: [
      { type: "Heritage Deluxe Room", price: 4900, available: 6 }
    ]
  },
  {
    id: "ht-rj-2",
    name: "Heritage Haveli Bundi",
    state: "Rajasthan",
    district: "Bundi",
    city: "Bundi Town",
    area: "Old Fort Road, Sadar Bazar",
    category: "Mid-Range",
    type: "Homestay",
    rating: 4.8,
    reviewsCount: 890,
    images: [
      "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "300-year-old Rajput haveli restored with hand-painted murals, courtyard dining, and direct view of Taragarh Fort.",
    basePrice: 2400,
    taxes: 288,
    discount: 200,
    amenities: ["Rooftop Fort View Restaurant", "Authentic Rajasthani Thali", "Free Wi-Fi", "Heritage Courtyard"],
    rooms: [
      { type: "Traditional Haveli Deluxe Room", price: 2400, available: 6 }
    ]
  },

  // --- Himachal Pradesh ---
  {
    id: "ht-hp-1",
    name: "The Himalayan Resort & Spa",
    state: "Himachal Pradesh",
    district: "Kullu",
    city: "Manali",
    area: "Hadimba Temple Road",
    category: "Luxury",
    type: "Resort",
    rating: 4.91,
    reviewsCount: 2350,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Gothic stone castle nestled among apple orchards and towering deodar pines with heated outdoor pool and views of snow peaks.",
    basePrice: 6500,
    taxes: 1170,
    discount: 600,
    amenities: ["Heated Swimming Pool", "Cast-Iron Fireplaces", "Apple Orchard Walks", "Mountain View Balconies"],
    rooms: [
      { type: "Grand Castle Chamber", price: 6500, available: 5 }
    ]
  },

  // --- Ladakh ---
  {
    id: "ht-la-1",
    name: "The Grand Dragon Ladakh",
    state: "Ladakh",
    district: "Leh",
    city: "Leh City",
    area: "Old Road Sheynam",
    category: "Luxury",
    type: "Hotel",
    rating: 4.9,
    reviewsCount: 1420,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "First luxury eco-resort in Ladakh with solar heated rooms, oxygen enrichment facilities, and 360° views of Stok Kangri mountains.",
    basePrice: 7500,
    taxes: 1350,
    discount: 500,
    amenities: ["Free High-speed Wi-Fi", "Oxygen Concentrator", "Solar Heating", "Mountain View Balcony", "Buffet Breakfast Included", "Spa & Sauna"],
    rooms: [
      { type: "Deluxe Himalayan View", price: 7500, available: 4 },
      { type: "Royal Heritage Suite", price: 12500, available: 2 }
    ]
  },

  // --- Uttarakhand ---
  {
    id: "ht-ut-1",
    name: "Aloha On The Ganges (Riverside Resort)",
    state: "Uttarakhand",
    district: "Dehradun",
    city: "Rishikesh",
    area: "Tapovan / Laxman Jhula Road",
    category: "Luxury",
    type: "Resort",
    rating: 4.92,
    reviewsCount: 4200,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Serene spiritual resort situated directly on the banks of holy River Ganga with infinity pool looking at the Shivalik foothills.",
    basePrice: 6900,
    taxes: 1242,
    discount: 500,
    amenities: ["Infinity Pool on Ganga Bank", "Morning Yoga Sessions", "Ayurvedic Panchakarma Spa", "Organic Cafe"],
    rooms: [
      { type: "Ganga Facing Superior Room", price: 6900, available: 5 }
    ]
  },

  // --- Uttar Pradesh ---
  {
    id: "ht-up-1",
    name: "BrijRama Palace Heritage (Varanasi Ghats)",
    state: "Uttar Pradesh",
    district: "Varanasi",
    city: "Varanasi",
    area: "Darbhanga Ghat, Dashashwamedh",
    category: "Luxury",
    type: "Hotel",
    rating: 4.96,
    reviewsCount: 3800,
    images: [
      "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "210-year-old palace on the ancient sacred ghats reached by royal bajra boat transfer with live classical sitar mornings.",
    basePrice: 11000,
    taxes: 1980,
    discount: 1000,
    amenities: ["Private Bajra Boat Pickup", "Ghat Facing Rooms", "Classical Sitar Performances", "Vegetarian Fine Dining"],
    rooms: [
      { type: "Palace Deluxe Room", price: 11000, available: 3 }
    ]
  }
];

export const seedGovTourism = [
  {
    id: "gov-1",
    name: "Swadesh Darshan 2.0 (Integrated Tourism Circuits)",
    ministry: "Ministry of Tourism, Government of India",
    category: "Central Initiative",
    description: "Flagship scheme developing sustainable, responsible tourist destinations across India with enhanced connectivity, local community livelihoods, and world-class visitor amenities.",
    eligibility: "Open to all Indian and international tourists visiting identified theme-based cultural & eco circuits.",
    benefits: [
      "Integrated tourist transit corridors",
      "Standardized clean facilities & eco-certified homestays",
      "Multilingual signage & verified local guide directories"
    ],
    officialLink: "https://tourism.gov.in/swadesh-darshan-scheme",
    lastVerified: "August 2026",
    activeStates: ["All 28 States & 8 UTs"]
  },
  {
    id: "gov-2",
    name: "PRASHAD (National Mission on Pilgrimage Rejuvenation)",
    ministry: "Ministry of Tourism, Government of India",
    category: "Spiritual & Heritage",
    description: "Holistic development of pilgrimage destinations like Varanasi, Amritsar, Puri, Mathura, Ajmer, Kedarnath, and Kamakhya with augmented spiritual infrastructure.",
    eligibility: "All pilgrims and heritage travelers.",
    benefits: [
      "Pilgrim facilitation centers & electronic lockers",
      "Illumination & audio guide kiosks at heritage shrines",
      "Accessible pathways for senior citizens and differently abled"
    ],
    officialLink: "https://tourism.gov.in/prashad-scheme",
    lastVerified: "August 2026",
    activeStates: ["Uttar Pradesh", "Punjab", "Odisha", "Tamil Nadu", "Uttarakhand", "Assam"]
  },
  {
    id: "gov-3",
    name: "Dekho Apna Desh & Tourist Police Network",
    ministry: "Ministry of Tourism in partnership with State Police",
    category: "Safety & Citizen Travel",
    description: "National citizen travel initiative coupled with dedicated 24/7 Tourist Police personnel deployed across major railway stations, airports, and monuments.",
    eligibility: "All travelers across India.",
    benefits: [
      "24/7 Multilingual Tourist Helpline (Dial 1363)",
      "Specialized tourist assistance booths at 100+ key sites",
      "Traveler safety advisory portal"
    ],
    officialLink: "https://www.incredibleindia.org/",
    lastVerified: "August 2026",
    activeStates: ["National Coverage"]
  },
  {
    id: "gov-4",
    name: "Kerala Responsible Tourism Ecotourism Incentive",
    ministry: "Kerala Tourism Board (DTPC)",
    category: "State Initiative",
    description: "Promoting village-life experiences, organic backwater farming tours, and zero-plastic green homestays directly supporting local artisans.",
    eligibility: "Travelers staying in certified Green Leaf eco-homestays in Kerala.",
    benefits: [
      "Discounted entry tickets to eco-parks & boat reserves",
      "Free village artisanal craft workshops",
      "Certified local guide accompaniment"
    ],
    officialLink: "https://www.keralatourism.org/responsible-tourism/",
    lastVerified: "July 2026",
    activeStates: ["Kerala"]
  }
];

export const seedTravelAlerts = [
  {
    id: "alt-1",
    destination: "Ladakh",
    type: "Road & Pass Status",
    severity: "info",
    title: "Khardung La Pass Clear & Operational",
    message: "Khardung La and Chang La passes are fully open for 4x4 and two-wheelers. Normal traffic flow reported.",
    updatedAt: "Today, 08:30 AM",
    isLive: true
  },
  {
    id: "alt-2",
    destination: "Himachal Pradesh",
    type: "Weather Alert",
    severity: "warning",
    title: "Moderate Rain Forecast in Kullu-Manali",
    message: "Light to moderate rain showers expected tomorrow afternoon. Plan outdoor paragliding in early morning slots.",
    updatedAt: "Today, 06:15 AM",
    isLive: true
  },
  {
    id: "alt-3",
    destination: "Meghalaya",
    type: "Eco Trail",
    severity: "info",
    title: "Nongriat Living Root Bridge Trails Open",
    message: "Forest department confirms clear stairs and pleasant weather for the Double Decker root bridge hike.",
    updatedAt: "Yesterday",
    isLive: true
  }
];
