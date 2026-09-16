// Verified Travel Companions Dataset with Simulated Verification Badges
export const mockTravelCompanions = [
  {
    id: "comp-1",
    name: "Aanya Sharma",
    age: 26,
    city: "Bengaluru, Karnataka",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    destination: "Ladakh (Pangong & Nubra)",
    travelDates: "Sept 15 - Sept 24, 2026",
    interests: ["Photography 📷", "High Altitude Trekking 🥾", "Stargazing ✨", "Cafes ☕"],
    bio: "UX Designer taking a break to photograph northern passes. Looking for 2-3 fellow travelers to split 4x4 cab costs from Leh and explore Turtuk.",
    isVerified: true,
    verificationBadge: "Government ID Verified ✓",
    tripsCompleted: 14,
    languages: ["English", "Hindi", "Kannada"],
    safetyRating: 4.95,
    badges: ["Verified Solo Traveler", "Eco Camper", "Punctual"]
  },
  {
    id: "comp-2",
    name: "Rohan Mukherjee",
    age: 29,
    city: "Kolkata, West Bengal",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    destination: "Meghalaya & Ziro Valley",
    travelDates: "Oct 10 - Oct 20, 2026",
    interests: ["Living Root Bridges 🌿", "Indie Music 🎵", "Local Food 🍲", "Backpacking 🎒"],
    bio: "Software Engineer heading to Ziro Music Festival and hiking the Nongriat Double Decker living root bridge. Seeking a curious travel buddy!",
    isVerified: true,
    verificationBadge: "Government ID Verified ✓",
    tripsCompleted: 9,
    languages: ["English", "Bengali", "Hindi"],
    safetyRating: 4.9,
    badges: ["Verified Adventurer", "Community Guide"]
  },
  {
    id: "comp-3",
    name: "Priyanka Nair",
    age: 27,
    city: "Kochi, Kerala",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    destination: "Spiti Valley & Chandratal",
    travelDates: "July 04 - July 14, 2026",
    interests: ["Motorbike Roadtrips 🏍️", "Monasteries 🧘", "Fossil Hunting 🔍"],
    bio: "Riding a Himalayan 450 through Spiti circuit from Shimla to Manali. Happy to ride in a small group for safety & shared homestay dinners.",
    isVerified: true,
    verificationBadge: "Government ID Verified ✓",
    tripsCompleted: 21,
    languages: ["Malayalam", "English", "Tamil", "Hindi"],
    safetyRating: 5.0,
    badges: ["Certified First Aider", "Expert Rider"]
  },
  {
    id: "comp-4",
    name: "Vikram Singhania",
    age: 31,
    city: "Jaipur, Rajasthan",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    destination: "Hampi & Badami Caves",
    travelDates: "Nov 02 - Nov 08, 2026",
    interests: ["History & Architecture 🏛️", "Coracle Boating 🛶", "Rock Climbing 🧗"],
    bio: "Architect obsessed with Vijayanagara stone masonry. Looking to explore Hampi boulders and ancient Chalukyan cave temples in Badami.",
    isVerified: true,
    verificationBadge: "Government ID Verified ✓",
    tripsCompleted: 11,
    languages: ["Hindi", "Rajasthani", "English"],
    safetyRating: 4.88,
    badges: ["Architecture Enthusiast", "Verified Profile"]
  },
  {
    id: "comp-5",
    name: "Divya Balasubramanian",
    age: 25,
    city: "Chennai, Tamil Nadu",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    destination: "Andaman & Nicobar (Havelock Scuba)",
    travelDates: "Dec 18 - Dec 26, 2026",
    interests: ["Scuba Diving 🤿", "Beach Sunsets 🏖️", "Seafood 🦐", "Kayaking 🚣"],
    bio: "PADI Open Water diver heading to Havelock & Neil Island for diving and bioluminescent kayaking. Looking for a dive buddy or small group.",
    isVerified: true,
    verificationBadge: "Government ID Verified ✓",
    tripsCompleted: 16,
    languages: ["Tamil", "English", "Telugu"],
    safetyRating: 4.98,
    badges: ["PADI Diver", "Verified Traveler"]
  },
  {
    id: "comp-6",
    name: "Kabir Mehta",
    age: 28,
    city: "Mumbai, Maharashtra",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
    destination: "Varanasi & Ayodhya",
    travelDates: "Oct 25 - Oct 30, 2026",
    interests: ["Spiritual Heritage 🕉️", "Street Photography 📷", "Ghat Sunrises 🌅"],
    bio: "Documenting early morning Subah-e-Banaras rituals, classical music sabhas, and evening Ganga Aarti. Looking for a fellow shutterbug!",
    isVerified: true,
    verificationBadge: "Government ID Verified ✓",
    tripsCompleted: 8,
    languages: ["Hindi", "Marathi", "English", "Gujarati"],
    safetyRating: 4.85,
    badges: ["Verified Solo Traveler"]
  }
];

export const safetyGuidelines = [
  {
    title: "1. Meet in Public Spaces First",
    detail: "Always plan your first meet-up in a crowded daytime public location (e.g., reputable cafe, airport lounge, or hotel lobby)."
  },
  {
    title: "2. Verify Profiles & Badges",
    detail: "Prioritize companions with the 'Government ID Verified ✓' badge. You can also request a live video call before finalizing trip itineraries."
  },
  {
    title: "3. Share Itinerary with Trusted Contacts",
    detail: "Use Yatra's built-in Emergency SOS system to share your companion's details, vehicle number, and live trip plan with your primary family contacts."
  },
  {
    title: "4. Keep Personal Finances Separate",
    detail: "Do not wire advance lump-sum payments to strangers. Settle hotels, cabs, and tickets directly with registered service operators or split bills via secure UPI on the spot."
  },
  {
    title: "5. Zero Tolerance for Misconduct",
    detail: "If any companion exhibits unsafe, threatening, or disrespectful behavior, immediately use the 'Report & Block' button and contact Tourist Police (1363 / 112)."
  }
];
