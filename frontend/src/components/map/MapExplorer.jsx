import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import {
  Compass,
  MapPin,
  Sparkles,
  Eye,
  Users,
  Search,
  Filter,
  ArrowRight,
  Maximize2
} from "lucide-react";
import { destinationsData } from "../../data/destinationsData";
import { useTheme } from "../../context/ThemeContext";
import { ViewpointBadge, CrowdBadge, HiddenGemBadge } from "../common/Badge";

// Helper component to center map on selection
const MapController = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

// Custom SVG Icons for Leaflet
const createCustomIcon = (type, isGem) => {
  let color = "#ff6b00"; // default brand saffron
  if (isGem) color = "#8b5cf6"; // purple gem
  else if (type === "nature") color = "#10b981"; // emerald
  else if (type === "spiritual") color = "#7c3aed"; // violet
  else if (type === "heritage") color = "#3b82f6"; // blue
  else if (type === "adventure") color = "#ef4444"; // red

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2.5px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        transform: translate(-50%, -50%);
        transition: transform 0.2s ease;
      ">
        ${isGem ? "✨" : "📍"}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

export const MapExplorer = ({ onSelectDestination, onPlanTrip }) => {
  const { isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [mapCenter, setMapCenter] = useState([22.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);
  const [selectedDestId, setSelectedDestId] = useState(null);

  const filteredMarkers = useMemo(() => {
    return destinationsData.filter((dest) => {
      // Filter tab
      if (activeFilter === "gems" && !dest.isHiddenGem) return false;
      if (activeFilter === "viewpoints" && dest.category !== "viewpoint") return false;
      if (activeFilter === "low-crowd" && dest.crowdLevel.toLowerCase() !== "low") return false;

      // Search
      if (search) {
        const q = search.toLowerCase();
        return (
          dest.name.toLowerCase().includes(q) ||
          dest.state.toLowerCase().includes(q) ||
          dest.district.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeFilter, search]);

  const handleSelectFromList = (dest) => {
    setMapCenter([dest.coordinates.lat, dest.coordinates.lng]);
    setMapZoom(9);
    setSelectedDestId(dest.id);
  };

  // Carto tile server
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px", height: "calc(100vh - 120px)" }}>
      {/* Top Header & Layer Filter Chips */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Pan-India Map Explorer
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            Explore 100+ destinations, hidden locations, and viewpoints with live map indicators
          </p>
        </div>

        {/* Filter Layer Chips */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveFilter("all")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-subtle)",
              background: activeFilter === "all" ? "var(--brand-primary)" : "var(--bg-tertiary)",
              color: activeFilter === "all" ? "#fff" : "var(--text-primary)",
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: "pointer"
            }}
          >
            All Spots ({destinationsData.length})
          </button>

          <button
            onClick={() => setActiveFilter("gems")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-subtle)",
              background: activeFilter === "gems" ? "var(--status-gem)" : "var(--bg-tertiary)",
              color: activeFilter === "gems" ? "#fff" : "var(--text-primary)",
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: "pointer"
            }}
          >
            ✨ Hidden Gems
          </button>

          <button
            onClick={() => setActiveFilter("viewpoints")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-subtle)",
              background: activeFilter === "viewpoints" ? "#0ea5e9" : "var(--bg-tertiary)",
              color: activeFilter === "viewpoints" ? "#fff" : "var(--text-primary)",
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: "pointer"
            }}
          >
            🌄 Viewpoints
          </button>

          <button
            onClick={() => setActiveFilter("low-crowd")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-subtle)",
              background: activeFilter === "low-crowd" ? "#10b981" : "var(--bg-tertiary)",
              color: activeFilter === "low-crowd" ? "#fff" : "var(--text-primary)",
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: "pointer"
            }}
          >
            🟢 Low Crowd
          </button>
        </div>
      </div>

      {/* Main Map + Sidebar Layout */}
      <div style={{ display: "flex", gap: "16px", flex: 1, minHeight: 0 }}>
        {/* Left Side Destination Jump List */}
        <div
          className="glass-panel desktop-map-drawer"
          style={{
            width: "300px",
            display: "none",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: "var(--radius-lg)"
          }}
        >
          {/* Search box */}
          <div style={{ padding: "12px", borderBottom: "1px solid var(--border-subtle)" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--bg-tertiary)",
                padding: "8px 12px",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-subtle)"
              }}
            >
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search map spots..."
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.85rem",
                  color: "var(--text-primary)",
                  width: "100%"
                }}
              />
            </div>
          </div>

          {/* List items */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {filteredMarkers.map((dest) => (
              <div
                key={dest.id}
                onClick={() => handleSelectFromList(dest)}
                style={{
                  padding: "10px",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "4px",
                  cursor: "pointer",
                  background: selectedDestId === dest.id ? "var(--brand-primary-light)" : "transparent",
                  border: "1px solid",
                  borderColor: selectedDestId === dest.id ? "var(--brand-primary)" : "transparent",
                  transition: "all var(--transition-fast)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2px" }}>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {dest.name}
                  </div>
                  {dest.isHiddenGem && <span style={{ fontSize: "0.7rem", color: "var(--status-gem)" }}>✨</span>}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {dest.district}, {dest.state}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Map Canvas */}
        <div
          className="glass-panel"
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)"
          }}
        >
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "100%", borderRadius: "var(--radius-lg)" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url={tileUrl}
            />
            <MapController center={mapCenter} zoom={mapZoom} />

            {filteredMarkers.map((dest) => (
              <Marker
                key={dest.id}
                position={[dest.coordinates.lat, dest.coordinates.lng]}
                icon={createCustomIcon(dest.category, dest.isHiddenGem)}
              >
                <Popup minWidth={240} maxWidth={280}>
                  <div style={{ padding: "4px", fontFamily: "var(--font-main)" }}>
                    <img
                      src={dest.images[0]}
                      alt={dest.name}
                      style={{
                        width: "100%",
                        height: "110px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "8px"
                      }}
                    />
                    <div style={{ display: "flex", gap: "4px", marginBottom: "4px", flexWrap: "wrap" }}>
                      {dest.isHiddenGem && <HiddenGemBadge />}
                      <ViewpointBadge status={dest.viewpointStatus} />
                    </div>

                    <h4 style={{ fontSize: "0.95rem", fontWeight: 800, margin: "4px 0 2px" }}>
                      {dest.name}
                    </h4>
                    <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "8px" }}>
                      {dest.district}, {dest.state}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "6px",
                        borderTop: "1px solid #e2e8f0"
                      }}
                    >
                      <button
                        onClick={() => onSelectDestination(dest)}
                        style={{
                          background: "var(--brand-gradient)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "var(--radius-full)",
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        Details
                      </button>

                      <button
                        onClick={() => onPlanTrip(dest)}
                        style={{
                          background: "#f1f5f9",
                          color: "#0f172a",
                          border: "none",
                          borderRadius: "var(--radius-full)",
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        Plan Trip
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .desktop-map-drawer {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};
