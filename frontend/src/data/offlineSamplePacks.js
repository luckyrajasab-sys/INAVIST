// Pre-curated Offline Trip Packs for Remote Indian Destinations
// Designed for offline use in high-altitude, dense forest, island, and rural destinations

export const OFFLINE_DESTINATIONS = [
  {
    id: "kodaikanal-vault",
    destinationId: "tn-kodaikanal-hills",
    name: "Kodaikanal",
    title: "Princess of Hill Stations",
    state: "Tamil Nadu",
    district: "Dindigul",
    region: "South India (Western Ghats - Palani Hills)",
    coordinates: { lat: 10.2381, lng: 77.4892 },
    elevation: "2,133 meters (6,998 ft)",
    downloadSizeMB: 245,
    heroImage: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
    lastCached: "Cached prior to departure",
    networkAlert: "Weak cellular reception on Pillar Rocks, Berijam forest corridor & Vattakanal trail",
    overview: "Nestled high in the granite cliffs of the Palani Hills, Kodaikanal is celebrated for its star-shaped lake, mist-covered pine forests, eucalyptus groves, and the rare Kurinji flower that blooms once every 12 years.",
    history: "Founded in 1845 as a refuge from the high temperatures and tropical diseases of the plains by American Christian missionaries and British bureaucrats. The star-shaped artificial lake was created in 1863 by Sir Vere Henry Levinge.",
    localCulture: "Famous for artisan handmade chocolates, eucalyptus and essential herbal oils, organic hill garlic, and vibrant Tibetan handicraft markets around the lake promenade.",
    cachedWeather: {
      temp: "17°C",
      condition: "Misty & Pleasant",
      humidity: "78%",
      rainfallChance: "25%",
      forecastNote: "Expect sudden mist rolls and evening temperature drops to 11°C. Carry warm windproof layers."
    },
    travelTips: [
      "Berijam Lake entry requires advance forest pass from Forest Department Office (available 8:30 AM - 10:00 AM).",
      "Cell signal drops completely beyond Dolphin's Nose and along the Poombarai village valley.",
      "Eco-charge of ₹20 applicable at Silver Cascade entrance.",
      "Wear sturdy walking shoes with grip; pine needle trails can become slippery during morning mist."
    ],
    // Offline POI Coordinates for Vector Map rendering & Distance calculations
    offlinePOIs: [
      { id: "k-1", name: "Kodaikanal Lake & Boat Club", category: "tourist", lat: 10.2341, lng: 77.4902, desc: "Star-shaped 60-acre lake with 5km cycling promenade", fee: "₹50 - ₹250 (Boating)", timings: "06:00 AM - 06:30 PM", distanceKm: 0.8 },
      { id: "k-2", name: "Coaker's Walk Pedestrian Ridge", category: "tourist", lat: 10.2312, lng: 77.4955, desc: "1km paved cliff walkway with telescope house & valley views", fee: "₹30", timings: "07:00 AM - 07:00 PM", distanceKm: 1.2 },
      { id: "k-3", name: "Bryant Park Botanical Garden", category: "tourist", lat: 10.2318, lng: 77.4930, desc: "20-acre landscaped park with 325 species of roses and trees", fee: "₹30", timings: "09:00 AM - 06:00 PM", distanceKm: 1.0 },
      { id: "k-4", name: "Pillar Rocks Viewpoint", category: "tourist", lat: 10.2078, lng: 77.4764, desc: "Three giant 122m granite boulders standing vertically", fee: "₹10", timings: "09:00 AM - 04:30 PM", distanceKm: 6.8 },
      { id: "k-5", name: "Dolphin's Nose & Echo Rock", category: "tourist", lat: 10.2155, lng: 77.5140, desc: "Flat rock projecting over a 6,600 ft deep precipice", fee: "Free (Trek)", timings: "06:00 AM - 05:30 PM", distanceKm: 7.2 },
      { id: "k-6", name: "Silver Cascade Waterfalls", category: "nature", lat: 10.2520, lng: 77.5255, desc: "180 ft waterfall formed from lake overflow", fee: "Free", timings: "24 Hours", distanceKm: 8.5 },
      
      // Stays
      { id: "k-h1", name: "The Carlton Luxury Heritage Hotel", category: "hotel", lat: 10.2355, lng: 77.4880, desc: "5-Star colonial lakefront resort", phone: "+91 4542 240056", distanceKm: 0.5 },
      { id: "k-h2", name: "Sterling Kodai Lake & Valley", category: "hotel", lat: 10.2388, lng: 77.4810, desc: "Scenic hillside family retreat", phone: "+91 4542 240600", distanceKm: 1.8 },
      { id: "k-h3", name: "Zostel Kodaikanal (Vattakanal)", category: "hotel", lat: 10.2180, lng: 77.5090, desc: "Backpackers social hostel near Dolphin's Nose", phone: "+91 4542 248910", distanceKm: 4.5 },

      // Food & Cafes
      { id: "k-f1", name: "Altaf's Cafe (Vattakanal)", category: "food", lat: 10.2190, lng: 77.5105, desc: "Famous Middle Eastern hummus, falafel & mountain herbal tea", phone: "+91 94882 71090", timings: "08:00 AM - 10:00 PM", distanceKm: 4.8 },
      { id: "k-f2", name: "Cloud Street Wood-fired Pizzeria", category: "food", lat: 10.2330, lng: 77.4915, desc: "Thin-crust artisan pizza & apple crumble", phone: "+91 4542 244580", timings: "12:00 PM - 09:30 PM", distanceKm: 0.9 },
      { id: "k-f3", name: "Tava Vegetarian Restaurant", category: "food", lat: 10.2325, lng: 77.4920, desc: "Authentic North & South Indian thalis", phone: "+91 4542 241822", timings: "08:00 AM - 10:30 PM", distanceKm: 1.1 },
      { id: "k-f4", name: "Pot Luck Cafe & Bakery", category: "food", lat: 10.2340, lng: 77.4900, desc: "Organic cinnamon rolls and filter coffee", phone: "+91 4542 245012", timings: "09:00 AM - 08:00 PM", distanceKm: 0.6 },

      // Hospitals & First Aid
      { id: "k-m1", name: "Kodaikanal Government Hospital", category: "hospital", lat: 10.2338, lng: 77.4860, desc: "24/7 Emergency Ward, Trauma & Ambulance Services", phone: "+91 4542 241250", distanceKm: 0.4, emergency: true },
      { id: "k-m2", name: "Van Allen Memorial Hospital", category: "hospital", lat: 10.2310, lng: 77.4970, desc: "Historic missionary hospital with emergency ICU", phone: "+91 4542 241273", distanceKm: 1.4, emergency: true },
      { id: "k-m3", name: "Apollo 24/7 Pharmacy & First Aid", category: "pharmacy", lat: 10.2345, lng: 77.4890, desc: "24-Hour essential medicines, bandaging & ORS", phone: "+91 4542 248900", distanceKm: 0.3 },

      // Police & Safety
      { id: "k-p1", name: "Kodaikanal Town Police Station", category: "police", lat: 10.2360, lng: 77.4875, desc: "Tourist Police desk & emergency dispatch", phone: "+91 4542 241025", distanceKm: 0.3, emergency: true },
      { id: "k-p2", name: "Forest Range Office (Berijam Permits)", category: "police", lat: 10.2370, lng: 77.4840, desc: "Official forest permits & wildlife emergency warden", phone: "+91 4542 240287", distanceKm: 0.9 },

      // Utilities: Petrol Pumps, ATMs, Bus Stand
      { id: "k-u1", name: "Indian Oil Petrol Pump (Main Bazaar)", category: "petrol", lat: 10.2380, lng: 77.4895, desc: "Fuel & tyre pressure service", distanceKm: 0.7 },
      { id: "k-u2", name: "Kodaikanal Central Bus Terminal (TNSTC & SETC)", category: "bus", lat: 10.2365, lng: 77.4865, desc: "Direct buses to Madurai, Dindigul, Palani, Bangalore", distanceKm: 0.5 },
      { id: "k-u3", name: "State Bank of India 24x7 ATM", category: "atm", lat: 10.2348, lng: 77.4885, desc: "Cash withdrawal (works during power cuts via generator)", distanceKm: 0.4 },
      { id: "k-u4", name: "Municipal Tourist Rest Shelter & Help Center", category: "shelter", lat: 10.2335, lng: 77.4898, desc: "Free drinking water, charging point & rain shelter", distanceKm: 0.7 }
    ],
    // Saved Day-by-Day Offline Itinerary
    itinerary: [
      {
        day: 1,
        date: "Day 1",
        title: "Lake Promenade & Heritage Walk",
        activities: [
          { id: "act-1", time: "09:00 AM", title: "Start from hotel & pick up local map", location: "Town Center", checked: true, note: "Keep jacket handy for afternoon clouds." },
          { id: "act-2", time: "10:00 AM", title: "Walk along scenic Coaker's Walk ridge", location: "Coaker's Walk", checked: true, note: "Look through the valley telescope house." },
          { id: "act-3", time: "12:00 PM", title: "Explore botanical flora at Bryant Park", location: "Bryant Park", checked: false, note: "Entrance ticket is ₹30." },
          { id: "act-4", time: "02:00 PM", title: "Lunch at Cloud Street Cafe (Wood-fired pizza)", location: "Cloud Street", checked: false, note: "Try the cinnamon apple crumble." },
          { id: "act-5", time: "04:00 PM", title: "Row boating & 5km cycling at Kodaikanal Lake", location: "Kodaikanal Lake", checked: false, note: "Bicycle rental: ₹80/hour near 7-Road junction." },
          { id: "act-6", time: "07:00 PM", title: "Return to hotel & dinner", location: "Hotel Stay", checked: false, note: "Temperature drops after 7 PM." }
        ]
      },
      {
        day: 2,
        date: "Day 2",
        title: "Pillar Rocks & Vattakanal Valley Trail",
        activities: [
          { id: "act-7", time: "08:30 AM", title: "Depart for Pillar Rocks viewpoint", location: "Pillar Rocks", checked: false, note: "Early morning has least fog and best photography." },
          { id: "act-8", time: "11:00 AM", title: "Guna Caves (Devil's Kitchen) pine forest walk", location: "Guna Caves", checked: false, note: "Caution on uneven roots." },
          { id: "act-9", time: "01:30 PM", title: "Trek to Dolphin's Nose via Vattakanal", location: "Vattakanal", checked: false, note: "Steep 1.5km descent. Cellular signal will drop here." },
          { id: "act-10", time: "03:30 PM", title: "Late lunch & ginger lemon tea at Altaf's Cafe", location: "Altaf's Cafe", checked: false, note: "Cash preferred in Vattakanal." },
          { id: "act-11", time: "06:00 PM", title: "Sunset at Upper Lake Viewpoint", location: "Upper Lake View", checked: false, note: "Panoramic view of star lake." }
        ]
      },
      {
        day: 3,
        date: "Day 3",
        title: "Poombarai Village & Silver Cascade",
        activities: [
          { id: "act-12", time: "09:00 AM", title: "Drive through terraced garlic village of Poombarai", location: "Poombarai Village", checked: false, note: "3,000-year-old Kuzhanthai Velappar Temple." },
          { id: "act-13", time: "01:00 PM", title: "Lunch with authentic Tamil hill cuisine", location: "Poombarai Local Canteen", checked: false, note: "Try organic hill garlic curry." },
          { id: "act-14", time: "03:30 PM", title: "Stop at Silver Cascade waterfalls on departure", location: "Silver Cascade", checked: false, note: "Watch out for mischievous monkeys." }
        ]
      }
    ],
    // Emergency Mode Data
    emergencyGuide: {
      contacts: [
        { title: "Kodaikanal Police Station", number: "+91 4542 241025", type: "police" },
        { title: "Govt Hospital Emergency (24/7)", number: "+91 4542 241250", type: "medical" },
        { title: "Forest Fire & Rescue Warden", number: "+91 4542 240287", type: "forest" },
        { title: "National Emergency Service", number: "112", type: "national" },
        { title: "Ambulance Emergency", number: "108", type: "ambulance" }
      ],
      firstAid: [
        {
          title: "Hypothermia & Sudden Cold Exposure",
          steps: [
            "Move person into dry, wind-sheltered area immediately.",
            "Remove wet clothing and wrap in warm layers or thermal blanket.",
            "Give warm sweetened fluids (tea or electrolyte soup) — never alcohol.",
            "Do not apply direct intense heat to bare skin."
          ]
        },
        {
          title: "Sprain or Ankle Twist on Rocky Trails",
          steps: [
            "Follow R.I.C.E protocol: Rest, Ice/Cold stream water compress, Compression, Elevation.",
            "Immobilize ankle with crepe bandage from offline first aid kit.",
            "Avoid putting weight on injured foot until evaluated."
          ]
        },
        {
          title: "Leech or Insect Bites in Forest",
          steps: [
            "Do not yank leech forcefully. Apply salt or lemon juice to detach naturally.",
            "Clean wound with antiseptic wipe and apply firm pressure if bleeding.",
            "Cover with sterile bandage."
          ]
        }
      ]
    },
    // Stored Offline Booking Documents
    storedDocuments: [
      {
        id: "doc-1",
        type: "hotel",
        title: "The Carlton Luxury Resort – Booking Voucher",
        bookingRef: "YATRI-HTL-882910",
        guestName: "Arjun Verma (2 Guests)",
        dates: "10 Sep 2026 – 14 Sep 2026 (4 Nights)",
        roomType: "Valley View Deluxe Room (Breakfast Included)",
        confirmationCode: "CRLTN-KOD-9941",
        hotelAddress: "Lake Road, Kodaikanal, Tamil Nadu 624101",
        hotelPhone: "+91 4542 240056",
        notes: "Present this offline booking code at reception. No internet connection required for check-in."
      },
      {
        id: "doc-2",
        type: "transport",
        title: "TNSTC Volvo Ultra Deluxe – Bus Ticket",
        bookingRef: "YATRI-BUS-449120",
        route: "Chennai CMBT $\rightarrow$ Kodaikanal Bus Stand",
        departure: "09 Sep 2026 | 08:30 PM",
        arrival: "10 Sep 2026 | 07:00 AM",
        seatNo: "Seats 11 & 12 (Lower Berth AC)",
        pnr: "TNSTC-8821940",
        notes: "Conductor will verify PNR and passenger name from printed/offline digital card."
      }
    ]
  },
  {
    id: "ladakh-vault",
    destinationId: "ladakh-pangong",
    name: "Leh & Pangong Tso",
    title: "High Altitude Himalayan Kingdom",
    state: "Ladakh",
    district: "Leh",
    region: "North India (Trans-Himalayas)",
    coordinates: { lat: 34.1526, lng: 77.5771 },
    elevation: "3,500m - 4,350m (14,270 ft)",
    downloadSizeMB: 310,
    heroImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
    lastCached: "Cached prior to departure",
    networkAlert: "Zero cellular coverage past Karu on Chang La pass, Spangmik & Nubra Valley sand dunes.",
    overview: "Land of high passes, ancient Tibetan Buddhist gompas, stark moonscapes, and high-altitude saltwater lakes.",
    history: "Former capital of the Himalayan kingdom of Ladakh, ruled by the Namgyal dynasty since 1553.",
    localCulture: "Laddakhi butter tea (Gur Gur Chai), barley tsampa, Thangka paintings, and Hemis monastic festivals.",
    cachedWeather: {
      temp: "8°C / -2°C Night",
      condition: "Crisp Sun & High UV",
      humidity: "20%",
      rainfallChance: "0%",
      forecastNote: "Extremely low humidity and thin air. Drink 4L water daily."
    },
    travelTips: [
      "Mandatory 48-hour acclimatization in Leh town before crossing Khardung La (17,982 ft).",
      "Inner Line Permit (ILP) required for Pangong Tso, Nubra Valley, and Tso Moriri.",
      "Carry physical cash as ATMs in Nubra and Pangong have no connectivity."
    ],
    offlinePOIs: [
      { id: "l-1", name: "Pangong Tso Lake Viewpoint", category: "tourist", lat: 33.7595, lng: 78.6674, desc: "Endorheic lake changing colors from blue to emerald", distanceKm: 140 },
      { id: "l-2", name: "Thiksey Monastery", category: "tourist", lat: 34.0560, lng: 77.6660, desc: "12-storey gompa resembling Potala Palace", distanceKm: 19 },
      { id: "l-m1", name: "SNM Hospital Leh (High Altitude Medicine)", category: "hospital", lat: 34.1610, lng: 77.5820, desc: "Hyperbaric oxygen chamber & 24/7 mountain trauma unit", phone: "+91 1982 252014", emergency: true },
      { id: "l-p1", name: "Leh Tourist Police Station", category: "police", lat: 34.1645, lng: 77.5840, desc: "Permit verification & emergency distress response", phone: "+91 1982 252018", emergency: true }
    ],
    itinerary: [
      {
        day: 1,
        date: "Day 1",
        title: "Complete Rest & Acclimatization",
        activities: [
          { id: "la-1", time: "10:00 AM", title: "Arrive at Leh Airport & transfer to hotel", location: "Leh Hotel", checked: true, note: "Do not exert. Stay hydrated." },
          { id: "la-2", time: "05:00 PM", title: "Gentle evening stroll at Leh Main Bazaar", location: "Main Bazaar", checked: false, note: "Buy dried apricots and sea buckthorn juice." }
        ]
      }
    ],
    emergencyGuide: {
      contacts: [
        { title: "SNM Hospital Leh", number: "+91 1982 252014", type: "medical" },
        { title: "Army Rescue / Air Force Helpline", number: "+91 1982 252112", type: "national" }
      ],
      firstAid: [
        {
          title: "Acute Mountain Sickness (AMS)",
          steps: [
            "Stop ascending immediately. Rest at current altitude.",
            "Administer supplementary portable oxygen if SpO2 drops below 75%.",
            "If headache or vomiting worsens, descend at least 500m immediately."
          ]
        }
      ]
    },
    storedDocuments: [
      {
        id: "doc-l1",
        type: "permit",
        title: "Ladakh Inner Line Permit (ILP)",
        bookingRef: "LA-ILP-2026-98112",
        guestName: "Arjun Verma",
        dates: "Valid: 15 Jun 2026 – 25 Jun 2026",
        confirmationCode: "LA-ADM-7719",
        notes: "Authorized for Pangong, Nubra, Turtuk, Tso Moriri. Show at Karu & North Pullu checkposts."
      }
    ]
  },
  {
    id: "munnar-vault",
    destinationId: "kl-munnar-tea",
    name: "Munnar & Western Ghats",
    title: "Tea Capital of South India",
    state: "Kerala",
    district: "Idukki",
    region: "South India (Anaimalai Hills)",
    coordinates: { lat: 10.0889, lng: 77.0595 },
    elevation: "1,600 meters (5,200 ft)",
    downloadSizeMB: 190,
    heroImage: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80",
    lastCached: "Cached prior to departure",
    networkAlert: "Network intermittent on Kolukkumalai off-road track & Top Station gap road.",
    overview: "Sprawling emerald tea plantations, spice-scented air, misty waterfalls, and the habitat of the endangered Nilgiri Tahr.",
    history: "Originally inhabited by the Muthuvan tribal community, developed into extensive tea estates in the 1870s by A.H. Sharp.",
    localCulture: "Fresh orthodox tea varieties, cardamoms, handmade chocolates, and Kathakali cultural performances.",
    cachedWeather: {
      temp: "19°C",
      condition: "Gentle Drizzle & Mist",
      humidity: "82%",
      rainfallChance: "40%",
      forecastNote: "Afternoon showers common. Carry waterproof rain shell."
    },
    travelTips: [
      "Eravikulam National Park requires online entry slot booking.",
      "Kolukkumalai sunrise trip requires 4x4 jeep hire from Suryanelli."
    ],
    offlinePOIs: [
      { id: "m-1", name: "Eravikulam National Park (Rajamalai)", category: "tourist", lat: 10.1500, lng: 77.0600, desc: "Nilgiri Tahr sanctuary & view of Anamudi peak", distanceKm: 12 },
      { id: "m-2", name: "Mattupetty Dam & Speedboating", category: "tourist", lat: 10.1060, lng: 77.1240, desc: "Masonry dam nestled among hills", distanceKm: 11 },
      { id: "m-m1", name: "Tata General Hospital Munnar", category: "hospital", lat: 10.0850, lng: 77.0620, desc: "24/7 emergency & snake antivenom unit", phone: "+91 4865 230222", emergency: true }
    ],
    itinerary: [
      {
        day: 1,
        date: "Day 1",
        title: "Tea Museum & Mattupetty Circuit",
        activities: [
          { id: "ma-1", time: "09:30 AM", title: "Visit KDHP Tea Museum & tasting", location: "KDHP Estate", checked: false, note: "Learn orthodox tea processing." },
          { id: "ma-2", time: "02:00 PM", title: "Speedboat ride at Mattupetty Lake", location: "Mattupetty Dam", checked: false, note: "Look out for wild elephant herds." }
        ]
      }
    ],
    emergencyGuide: {
      contacts: [
        { title: "Tata General Hospital", number: "+91 4865 230222", type: "medical" },
        { title: "Munnar Police Station", number: "+91 4865 230321", type: "police" }
      ],
      firstAid: [
        {
          title: "Wild Elephant Encounter on Hill Roads",
          steps: [
            "Maintain minimum 100-meter distance. Do not honk, rev engine, or use flash.",
            "Slowly reverse vehicle without sudden acceleration.",
            "Stay inside vehicle until elephants cross naturally into forest."
          ]
        }
      ]
    },
    storedDocuments: [
      {
        id: "doc-m1",
        type: "hotel",
        title: "Fragrant Nature Munnar – Eco Resort",
        bookingRef: "YATRI-HTL-331902",
        dates: "18 Oct 2026 – 21 Oct 2026",
        confirmationCode: "FRGNT-MUN-4011",
        notes: "Fireplace suite voucher with plantation walk included."
      }
    ]
  }
];
