import React from "react";
import { useTheme } from "../../context/ThemeContext";

// Comprehensive Full-Bleed High-Vibrancy Photography for all 28 Indian States & UTs featuring iconic temples, sacred idols, and landscapes
export const STATE_BACKDROPS = {
  "Tamil Nadu": {
    img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2200&q=90", // Madurai Meenakshi Amman Temple Gopuram & Bronze Idols
    title: "Tamil Nadu — Sacred Meenakshi & Thanjavur Temples"
  },
  "Karnataka": {
    img: "https://images.unsplash.com/photo-1600100397608-f010f4448553?auto=format&fit=crop&w=2200&q=90", // Hampi Virupaksha Temple & Stone Chariot
    title: "Karnataka — Hampi Virupaksha & Murudeshwar Shiva Shrine"
  },
  "Odisha": {
    img: "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=2200&q=90", // Konark Sun Temple Sun Chariot & Puri Jagannath Idols
    title: "Odisha — Konark Sun Temple & Lord Jagannath Puri"
  },
  "Uttar Pradesh": {
    img: "https://images.unsplash.com/photo-1561361066-613d52d9a691?auto=format&fit=crop&w=2200&q=90", // Varanasi Kashi Vishwanath Ghats & Ayodhya Ram Mandir
    title: "Uttar Pradesh — Varanasi Sacred Ghats & Ram Janmabhoomi"
  },
  "Madhya Pradesh": {
    img: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=2200&q=90", // Khajuraho Intricate Stone Sculptures & Mahakaleshwar
    title: "Madhya Pradesh — Khajuraho Temples & Mahakaleshwar Jyotirlinga"
  },
  "Uttarakhand": {
    img: "https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=2200&q=90", // Kedarnath Shiva Dham & Rishikesh Ganga Overlook
    title: "Uttarakhand — Kedarnath Dham & Devbhoomi Himalayas"
  },
  "Punjab": {
    img: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=2200&q=90", // Harmandir Sahib Golden Temple & Sacred Amrit Sarovar
    title: "Punjab — Amritsar Golden Temple & Sacred Sarovar"
  },
  "Maharashtra": {
    img: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=2200&q=90", // Ellora Kailasa Rock-Cut Temple & Lord Ganesha
    title: "Maharashtra — Kailasa Rock Temple & Ashtavinayak Shrines"
  },
  "Gujarat": {
    img: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=2200&q=90", // Somnath Jyotirlinga Shore Temple & Dwarkadhish
    title: "Gujarat — Somnath Jyotirlinga & Dwarkadhish Dham"
  },
  "Sikkim": {
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2200&q=90", // Ravangla 130ft Giant Golden Buddha Idol
    title: "Sikkim — Buddha Park of Ravangla & Kanchenjunga"
  },
  "Ladakh": {
    img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=2200&q=90", // Maitreya Buddha 106ft Idol at Diskit Monastery & Pangong
    title: "Ladakh — Diskit Maitreya Buddha & Thiksey Gompa"
  },
  "Rajasthan": {
    img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2200&q=90", // Ranakpur 1444 Pillar Jain Temple & Amer Fort
    title: "Rajasthan — Ranakpur Marble Temple & Amer Palace"
  },
  "Kerala": {
    img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2200&q=90", // Padmanabhaswamy Temple & Emerald Backwaters
    title: "Kerala — Sree Padmanabhaswamy & Munnar Hills"
  },
  "Himachal Pradesh": {
    img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2200&q=90", // Baijnath Ancient Shiva Temple & Spiti Monastery
    title: "Himachal Pradesh — Baijnath Shiva Temple & Key Monastery"
  },
  "Delhi": {
    img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2200&q=90", // Akshardham Temple Monument & Lotus Temple
    title: "Delhi — Akshardham Grand Temple & Heritage Vista"
  },
  "Bihar": {
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2200&q=90", // Mahabodhi Temple Great Buddha Statue Bodh Gaya
    title: "Bihar — Bodh Gaya Mahabodhi Temple & Great Buddha Idol"
  },
  "Goa": {
    img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2200&q=90", // Basilica of Bom Jesus & Mangueshi Temple
    title: "Goa — Basilica of Bom Jesus & Azure Coastlines"
  },
  "Meghalaya": {
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2200&q=90", // Living Root Bridges & Dawki Crystal Glass River
    title: "Meghalaya — Sacred Groves & Living Root Bridges"
  },
  "Jammu and Kashmir": {
    img: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2200&q=90", // Vaishno Devi Bhawan & Shankaracharya Temple
    title: "Jammu & Kashmir — Shankaracharya Temple & Dal Lake"
  },
  "West Bengal": {
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2200&q=90", // Dakshineswar Kali Temple & Belur Math
    title: "West Bengal — Dakshineswar Kali Temple & Darjeeling"
  },
  "Assam": {
    img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2200&q=90", // Kamakhya Devi Shakti Peeth Temple & Brahmaputra
    title: "Assam — Kamakhya Devi Temple & Kaziranga"
  },
  "Arunachal Pradesh": {
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=90", // Tawang Monastery (Largest in India) & Golden Buddha
    title: "Arunachal Pradesh — Tawang Monastery Golden Buddha"
  },
  "Andhra Pradesh": {
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2200&q=90", // Tirupati Balaji Temple & Lepakshi Monolithic Nandi Idol
    title: "Andhra Pradesh — Tirupati Venkateswara & Lepakshi Nandi"
  },
  "Telangana": {
    img: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=2200&q=90", // Ramappa UNESCO Temple & Thousand Pillar Shrine
    title: "Telangana — Ramappa UNESCO Temple & Kakatiya Idols"
  },
  "Andaman and Nicobar": {
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=90", // Radhanagar Beach & Turquoise Bay
    title: "Andaman & Nicobar — Radhanagar Beach & Coral Lagoons"
  },
  "Lakshadweep": {
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2200&q=90", // Agatti White Sand Coral Island Atolls
    title: "Lakshadweep — Coral Lagoon Paradise"
  }
};

export const IndianHeritageBackdrop = ({ activeTab = "home", customBackdropImg = null }) => {
  const { isDark } = useTheme();

  // Curated Section Defaults
  const pageBackdrops = {
    home: {
      img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2000&q=90",
      title: "Indian Nature & Himalayan Valleys"
    },
    vault: {
      img: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=2000&q=90",
      title: "Travel Vault — Offline Trip Companion"
    },
    explore: {
      img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2000&q=90", // Meenakshi Temple Gopuram & Idols
      title: "Sacred Temples & Ancient Heritage"
    },
    hotels: {
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=90",
      title: "Luxury Havelis & Nature Homestays"
    },
    transport: {
      img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2000&q=90",
      title: "Indian Rail & Highway Corridors"
    },
    planner: {
      img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=90",
      title: "Smart Itinerary & Adventure Trail"
    },
    localGuide: {
      img: "https://images.unsplash.com/photo-1561361066-613d52d9a691?auto=format&fit=crop&w=2200&q=90", // Vibrant Varanasi Ghats & Temple Aarti Gathering Crowd
      title: "YĀTRI Local — Living Heritage, Bazaars & Cultural Crowds"
    },
    govTourism: {
      img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=90",
      title: "Government Tourism Initiatives"
    },
    budget: {
      img: "https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=2000&q=90",
      title: "Budget Travel & Pocket Escapes"
    },
    gps: {
      img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2000&q=90",
      title: "GPS Maps & Waypoint Navigation"
    },
    map: {
      img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=2000&q=90",
      title: "Pan-India Interactive Map"
    },
    companions: {
      img: "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=2000&q=90",
      title: "Verified Travel Companions"
    },
    history: {
      img: "https://images.unsplash.com/photo-1600100397608-f010f4448553?auto=format&fit=crop&w=2000&q=90",
      title: "Digital Passport & Travel Footprints"
    },
    safety: {
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=90",
      title: "SOS Safety Center"
    },
    profile: {
      img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2000&q=90",
      title: "Traveler Profile & Preferences"
    },
    admin: {
      img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2000&q=90",
      title: "Platform Administration"
    }
  };

  // Determine active backdrop: check if customBackdropImg is a direct image URL or State Name
  let finalImg = pageBackdrops[activeTab]?.img || pageBackdrops.home.img;
  if (customBackdropImg) {
    if (STATE_BACKDROPS[customBackdropImg]) {
      finalImg = STATE_BACKDROPS[customBackdropImg].img;
    } else {
      finalImg = customBackdropImg;
    }
  }

  return (
    <div
      className="indian-heritage-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden"
      }}
      aria-hidden="true"
    >
      {/* Full-Bleed Clear Background with Dynamic Sacred Temple & State Photo Transitions */}
      <div
        key={`bg-${activeTab}-${finalImg}`}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('${finalImg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          opacity: isDark ? 0.68 : 0.88,
          filter: isDark
            ? "contrast(125%) saturate(145%) brightness(78%)"
            : "contrast(115%) saturate(150%) brightness(98%)",
          transition: "background-image 0.6s ease-in-out, filter 0.4s ease, opacity 0.4s ease"
        }}
      />
    </div>
  );
};
