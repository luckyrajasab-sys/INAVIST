import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import {
  Navigation,
  MapPin,
  Hospital,
  Shield,
  Fuel,
  Utensils,
  Bus,
  Footprints,
  Car,
  Compass,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { usePlanner } from "../../context/PlannerContext";

const MapRecenter = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) map.flyTo(center, 13);
  }, [center, map]);
  return null;
};

// Custom Marker Creators
const createPOIIcon = (emoji, color) => {
  return L.divIcon({
    className: "custom-poi-marker",
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
      ">${emoji}</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export const GPSNavigation = () => {
  const { showToast } = usePlanner();

  // User simulated GPS center (e.g. Connaught Place, New Delhi or selected hub)
  const [userLocation, setUserLocation] = useState([28.6315, 77.2167]);
  const [destLocation, setDestLocation] = useState([28.5933, 77.2507]); // Humayun Tomb
  const [navMode, setNavMode] = useState("driving"); // 'walking' | 'driving' | 'transit'
  const [activePOIType, setActivePOIType] = useState("all");
  const [isNavigating, setIsNavigating] = useState(false);

  const pois = [
    { id: "poi-1", type: "hospital", name: "Max Super Speciality Hospital", distance: "1.2 km", coords: [28.6250, 77.2100], emoji: "🏥", color: "#EF4444", contact: "011-26515050" },
    { id: "poi-2", type: "police", name: "Connaught Place Police Station & Tourist Desk", distance: "450 m", coords: [28.6330, 77.2200], emoji: "👮", color: "#0E7490", contact: "112" },
    { id: "poi-3", type: "fuel", name: "Indian Oil Petrol & Fast EV Charger", distance: "800 m", coords: [28.6350, 77.2120], emoji: "⛽", color: "#EA580C", hours: "24 Hours" },
    { id: "poi-4", type: "food", name: "Saravana Bhavan & Indian Coffee House", distance: "300 m", coords: [28.6300, 77.2190], emoji: "🍽️", color: "#10B981", cuisine: "Authentic South & North Indian" },
    { id: "poi-5", type: "transit", name: "Rajiv Chowk Metro Interchange Hub", distance: "200 m", coords: [28.6328, 77.2195], emoji: "🚏", color: "#8B5CF6", lines: "Blue & Airport Express Lines" }
  ];

  const filteredPOIs = activePOIType === "all" ? pois : pois.filter((p) => p.type === activePOIType);

  const handleStartNavigation = () => {
    setIsNavigating(true);
    showToast(`Turn-by-turn navigation started (${navMode.toUpperCase()} mode)! 📍`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px", height: "calc(100vh - 120px)" }}>
      {/* Top Controls Bar */}
      <div
        className="glass-panel"
        style={{
          padding: "16px 20px",
          borderRadius: "var(--radius-xl)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "14px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #0E7490 0%, #14B8A6 100%)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Navigation size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>GPS Maps & Navigation</h2>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Live Waypoint Routing & Nearby POI Radar</span>
          </div>
        </div>

        {/* POI Filter Chips */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {[
            { id: "all", label: "All Nearby" },
            { id: "hospital", label: "🏥 Hospitals", color: "#EF4444" },
            { id: "police", label: "👮 Police", color: "#0E7490" },
            { id: "food", label: "🍽️ Food", color: "#10B981" },
            { id: "fuel", label: "⛽ Fuel/EV", color: "#EA580C" },
            { id: "transit", label: "🚏 Transit", color: "#8B5CF6" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePOIType(item.id)}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius-full)",
                border: "1px solid",
                borderColor: activePOIType === item.id ? "var(--brand-primary)" : "var(--border-subtle)",
                background: activePOIType === item.id ? "var(--brand-primary)" : "var(--bg-tertiary)",
                color: activePOIType === item.id ? "#fff" : "var(--text-primary)",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer"
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Navigation Mode & Action */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", background: "var(--bg-tertiary)", padding: "4px", borderRadius: "var(--radius-full)", border: "1px solid var(--border-subtle)" }}>
            <button
              onClick={() => setNavMode("walking")}
              style={{ padding: "6px 10px", borderRadius: "var(--radius-full)", border: "none", background: navMode === "walking" ? "var(--brand-ocean)" : "transparent", color: navMode === "walking" ? "#fff" : "inherit", cursor: "pointer" }}
              title="Walking mode"
            >
              <Footprints size={16} />
            </button>
            <button
              onClick={() => setNavMode("driving")}
              style={{ padding: "6px 10px", borderRadius: "var(--radius-full)", border: "none", background: navMode === "driving" ? "var(--brand-ocean)" : "transparent", color: navMode === "driving" ? "#fff" : "inherit", cursor: "pointer" }}
              title="Driving mode"
            >
              <Car size={16} />
            </button>
            <button
              onClick={() => setNavMode("transit")}
              style={{ padding: "6px 10px", borderRadius: "var(--radius-full)", border: "none", background: navMode === "transit" ? "var(--brand-ocean)" : "transparent", color: navMode === "transit" ? "#fff" : "inherit", cursor: "pointer" }}
              title="Public transit mode"
            >
              <Bus size={16} />
            </button>
          </div>

          <button className="btn-primary" onClick={handleStartNavigation} style={{ padding: "8px 18px", fontSize: "0.85rem" }}>
            <Navigation size={15} />
            <span>{isNavigating ? "Recalculate Route" : "Navigate"}</span>
          </button>
        </div>
      </div>

      {/* Map Body Layout */}
      <div style={{ display: "flex", gap: "16px", flex: 1, minHeight: 0 }}>
        {/* Left Side Route & POI Info Panel */}
        <div
          className="glass-panel"
          style={{
            width: "320px",
            padding: "16px",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            overflowY: "auto"
          }}
        >
          {/* Active Navigation Summary */}
          <div style={{ background: "linear-gradient(135deg, rgba(14, 116, 144, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--brand-ocean)", fontWeight: 800, textTransform: "uppercase" }}>
              Active Route ({navMode.toUpperCase()})
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, margin: "4px 0" }}>
              6.4 km • 18 mins
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              Via Barakhamba Rd & Mathura Rd • Moderate Traffic
            </div>
          </div>

          {/* POI Nearby List */}
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, marginBottom: "8px" }}>
              Nearby Services Radar ({filteredPOIs.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {filteredPOIs.map((poi) => (
                <div
                  key={poi.id}
                  style={{
                    background: "var(--bg-tertiary)",
                    borderRadius: "var(--radius-md)",
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.2rem" }}>{poi.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{poi.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{poi.distance} away</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Leaflet Map */}
        <div
          className="glass-panel"
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            borderRadius: "var(--radius-lg)"
          }}
        >
          <MapContainer
            center={userLocation}
            zoom={13}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "100%", borderRadius: "var(--radius-lg)" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <MapRecenter center={userLocation} />

            {/* User Current Location Marker */}
            <Marker position={userLocation} icon={createPOIIcon("📍", "#0B1F33")}>
              <Popup>
                <div style={{ fontFamily: "var(--font-main)", padding: "4px" }}>
                  <strong>Your GPS Location</strong>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Connaught Place, New Delhi</div>
                </div>
              </Popup>
            </Marker>

            {/* Destination Marker */}
            <Marker position={destLocation} icon={createPOIIcon("🏁", "#F97316")}>
              <Popup>
                <div style={{ fontFamily: "var(--font-main)", padding: "4px" }}>
                  <strong>Destination: Humayun's Tomb</strong>
                </div>
              </Popup>
            </Marker>

            {/* Route Line */}
            <Polyline
              positions={[
                userLocation,
                [28.6200, 77.2300],
                [28.6050, 77.2400],
                destLocation
              ]}
              color="#F97316"
              weight={5}
              opacity={0.8}
              dashArray="8, 6"
            />

            {/* POI Markers */}
            {filteredPOIs.map((poi) => (
              <Marker key={poi.id} position={poi.coords} icon={createPOIIcon(poi.emoji, poi.color)}>
                <Popup>
                  <div style={{ fontFamily: "var(--font-main)", padding: "4px" }}>
                    <h4 style={{ fontSize: "0.9rem", fontWeight: 800, margin: "0 0 2px" }}>{poi.name}</h4>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Distance: {poi.distance}</div>
                    {poi.contact && <div style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: 700 }}>Contact: {poi.contact}</div>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
