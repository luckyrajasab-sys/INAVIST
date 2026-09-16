import React, { useState, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  Building,
  MapPin,
  Star,
  Search,
  Filter,
  CheckCircle,
  IndianRupee,
  ShieldCheck,
  Sparkles,
  X,
  CreditCard,
  RotateCcw,
  Compass
} from "lucide-react";
import { seedHotels } from "../../data/seedData";
import { usePlanner } from "../../context/PlannerContext";
import { useAuth } from "../../context/AuthContext";
import { getAllStates } from "../../data/destinationsData";

export const HotelSearch = () => {
  const { showToast } = usePlanner();
  const { isAuthenticated, openAuthModal, user } = useAuth();

  // Multi-tier Search States
  const [selectedState, setSelectedState] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedArea, setSelectedArea] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Booking States
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [nights, setNights] = useState(2);
  const [guests, setGuests] = useState(2);
  const [isBookingDone, setIsBookingDone] = useState(false);

  const hotelTypes = [
    { id: "all", label: "All Accommodations" },
    { id: "Hotel", label: "Hotels 🏨" },
    { id: "Resort", label: "Resorts 🌴" },
    { id: "Homestay", label: "Heritage Homestays 🏡" },
    { id: "Hostel", label: "Backpacker Hostels 🎒" }
  ];

  // Dynamic available states from hotels list
  const availableStates = useMemo(() => {
    const s = new Set(seedHotels.map((h) => h.state));
    return Array.from(s).sort();
  }, []);

  // Dynamic available districts based on selected state
  const availableDistricts = useMemo(() => {
    const list = selectedState === "all"
      ? seedHotels
      : seedHotels.filter((h) => h.state.toLowerCase() === selectedState.toLowerCase());
    const d = new Set(list.map((h) => h.district));
    return Array.from(d).sort();
  }, [selectedState]);

  // Dynamic available local areas based on selected state & district
  const availableAreas = useMemo(() => {
    let list = seedHotels;
    if (selectedState !== "all") {
      list = list.filter((h) => h.state.toLowerCase() === selectedState.toLowerCase());
    }
    if (selectedDistrict !== "all") {
      list = list.filter((h) => h.district.toLowerCase() === selectedDistrict.toLowerCase());
    }
    const a = new Set(list.map((h) => h.area));
    return Array.from(a).sort();
  }, [selectedState, selectedDistrict]);

  // Filtered Hotels calculation
  const filteredHotels = useMemo(() => {
    return seedHotels.filter((hotel) => {
      // 1. State Filter
      if (selectedState !== "all" && hotel.state.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }
      // 2. District Filter
      if (selectedDistrict !== "all" && hotel.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
        return false;
      }
      // 3. Local Area Filter
      if (selectedArea.trim() && !hotel.area.toLowerCase().includes(selectedArea.trim().toLowerCase())) {
        return false;
      }
      // 4. Type & Category Filter
      if (selectedType !== "all" && hotel.type !== selectedType) return false;
      if (selectedCategory !== "all" && hotel.category !== selectedCategory) return false;
      // 5. Keyword Search
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchesName = hotel.name.toLowerCase().includes(q);
        const matchesCity = hotel.city.toLowerCase().includes(q);
        const matchesArea = hotel.area.toLowerCase().includes(q);
        const matchesAmenities = hotel.amenities?.some((a) => a.toLowerCase().includes(q));
        if (!matchesName && !matchesCity && !matchesArea && !matchesAmenities) {
          return false;
        }
      }
      return true;
    });
  }, [selectedState, selectedDistrict, selectedArea, searchKeyword, selectedType, selectedCategory]);

  const handleStateChange = (st) => {
    setSelectedState(st);
    setSelectedDistrict("all");
    setSelectedArea("");
  };

  const handleResetFilters = () => {
    setSelectedState("all");
    setSelectedDistrict("all");
    setSelectedArea("");
    setSearchKeyword("");
    setSelectedType("all");
    setSelectedCategory("all");
    showToast("Filters reset to all verified stays");
  };

  const handleOpenHotel = (hotel) => {
    if (!isAuthenticated) {
      showToast(`Please Sign In or Create an Account to complete hotel reservation! 🏨`);
      openAuthModal("signin");
      return;
    }
    setSelectedHotel(hotel);
    setSelectedRoom(hotel.rooms[0]);
    setIsBookingDone(false);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast(`Please Sign In or Create an Account to complete hotel reservation! 🏨`);
      openAuthModal("signin");
      return;
    }
    setIsBookingDone(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    showToast(`Reservation Confirmed at ${selectedHotel.name}! 🏨`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", padding: "24px 20px" }}>
      {/* Guest Mode Informational Banner */}
      {!isAuthenticated && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            padding: "14px 20px",
            borderRadius: "var(--radius-xl, 16px)",
            background: "linear-gradient(135deg, rgba(234, 88, 12, 0.12) 0%, rgba(14, 116, 144, 0.1) 100%)",
            border: "1.5px solid rgba(234, 88, 12, 0.35)",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(234, 88, 12, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#EA580C" }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <strong style={{ fontSize: "0.90rem", color: "var(--text-primary)", display: "block" }}>
                Preview Mode (Sign In Required to Book Rooms)
              </strong>
              <span style={{ fontSize: "0.80rem", color: "var(--text-secondary)" }}>
                You can browse verified hotels, homestays, resorts & room rates freely. Sign in or create an account to reserve rooms and obtain instant vouchers.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openAuthModal("signin")}
            style={{
              padding: "8px 18px",
              borderRadius: "9999px",
              border: "none",
              background: "var(--brand-primary, #2563EB)",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "0.82rem",
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(37,99,235,0.3)"
            }}
          >
            Sign In / Sign Up
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: "36px 30px",
          background: "linear-gradient(135deg, rgba(14, 116, 144, 0.1) 0%, rgba(20, 184, 166, 0.08) 100%), var(--bg-card)",
          borderRadius: "var(--radius-xl)"
        }}
      >
        <div style={{ maxWidth: "700px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(14, 116, 144, 0.12)",
              color: "#0E7490",
              padding: "4px 12px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.78rem",
              fontWeight: 700,
              marginBottom: "10px"
            }}
          >
            <Building size={14} />
            <span>State $\rightarrow$ District $\rightarrow$ Local Area Stay Finder</span>
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "8px" }}>
            Hotels & Verified Stays
          </h1>
          <p style={{ fontSize: "0.98rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Filter stays by State, District, and Local Landmark Area across India with transparent all-inclusive tariff breakdown.
          </p>
        </div>
      </div>

      {/* ADVANCED MULTI-TIER SEARCH CONSOLE */}
      <div
        className="glass-card"
        style={{
          borderRadius: "var(--radius-2xl, 20px)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          background: "var(--bg-card)",
          border: "1.5px solid var(--border-subtle)",
          boxShadow: "var(--shadow-md)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Compass size={18} color="var(--brand-primary, #2563EB)" />
            <strong style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>
              Search by State, District & Local Area
            </strong>
          </div>

          {(selectedState !== "all" || selectedDistrict !== "all" || selectedArea || searchKeyword || selectedType !== "all") && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
                fontSize: "0.76rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              <RotateCcw size={12} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* 4-Input Grid: State, District, Local Area, Keyword Search */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "14px",
            alignItems: "flex-end"
          }}
        >
          {/* 1. STATE SELECTOR */}
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "5px", display: "block" }}>
              1. State / UT
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 12px",
                borderRadius: "var(--radius-md, 10px)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="all">All Indian States (All India)</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* 2. DISTRICT SELECTOR */}
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "5px", display: "block" }}>
              2. District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedArea("");
              }}
              style={{
                width: "100%",
                padding: "11px 12px",
                borderRadius: "var(--radius-md, 10px)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="all">All Districts {selectedState !== "all" ? `in ${selectedState}` : ""}</option>
              {availableDistricts.map((dst) => (
                <option key={dst} value={dst}>{dst} District</option>
              ))}
            </select>
          </div>

          {/* 3. LOCAL AREA / LANDMARK INPUT */}
          <div style={{ position: "relative" }}>
            <label style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "5px", display: "block" }}>
              3. Local Area / Landmark
            </label>
            <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
              <input
                type="text"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                placeholder="e.g. Lake Road, Fort Kochi, Calangute..."
                style={{
                  width: "100%",
                  padding: "11px 12px 11px 34px",
                  borderRadius: "var(--radius-md, 10px)",
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  outline: "none"
                }}
              />
              <MapPin size={15} color="var(--brand-primary, #2563EB)" style={{ position: "absolute", left: "10px" }} />
              {selectedArea && (
                <button
                  type="button"
                  onClick={() => setSelectedArea("")}
                  style={{
                    position: "absolute",
                    right: "8px",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer"
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* 4. KEYWORD SEARCH */}
          <div style={{ position: "relative" }}>
            <label style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "5px", display: "block" }}>
              4. Hotel Name / Amenities
            </label>
            <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search resort, pool, lake view..."
                style={{
                  width: "100%",
                  padding: "11px 12px 11px 34px",
                  borderRadius: "var(--radius-md, 10px)",
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  outline: "none"
                }}
              />
              <Search size={15} color="var(--text-muted)" style={{ position: "absolute", left: "10px" }} />
            </div>
          </div>
        </div>

        {/* Accommodation Type Tabs */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingTop: "6px", borderTop: "1px solid var(--border-subtle)" }}>
          {hotelTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              style={{
                padding: "7px 16px",
                borderRadius: "var(--radius-full)",
                border: "1px solid",
                borderColor: selectedType === t.id ? "var(--brand-primary, #2563EB)" : "var(--border-subtle)",
                background: selectedType === t.id ? "var(--brand-primary, #2563EB)" : "var(--bg-tertiary)",
                color: selectedType === t.id ? "#ffffff" : "var(--text-primary)",
                fontWeight: selectedType === t.id ? 800 : 600,
                fontSize: "0.82rem",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hotels Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "24px"
        }}
      >
        {filteredHotels.map((hotel) => {
          const finalPayable = hotel.basePrice + hotel.taxes - hotel.discount;
          return (
            <div
              key={hotel.id}
              className="glass-card"
              onClick={() => handleOpenHotel(hotel)}
              style={{
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div style={{ position: "relative", width: "100%", height: "200px" }}>
                <img
                  src={hotel.images[0]}
                  alt={hotel.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(11, 31, 51, 0.75)", backdropFilter: "blur(6px)", color: "#fff", padding: "4px 10px", borderRadius: "var(--radius-full)", fontSize: "0.72rem", fontWeight: 700 }}>
                  {hotel.category} • {hotel.type}
                </div>

                <div style={{ position: "absolute", bottom: "10px", left: "12px", right: "12px", display: "flex", justifyContent: "space-between", color: "#fff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.76rem", fontWeight: 700, background: "rgba(0,0,0,0.6)", padding: "3px 8px", borderRadius: "var(--radius-full)", backdropFilter: "blur(4px)" }}>
                    <MapPin size={12} color="#F97316" />
                    <span>{hotel.area}, {hotel.district}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px", background: "rgba(0,0,0,0.6)", padding: "3px 8px", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 700, backdropFilter: "blur(4px)" }}>
                    <Star size={12} color="#EA580C" fill="#EA580C" />
                    <span>{hotel.rating}</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: "18px", display: "flex", flexDirection: "column", flex: 1, gap: "10px" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "4px" }}>{hotel.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 700 }}>
                    <span style={{ color: "var(--brand-primary, #2563EB)" }}>{hotel.area}</span>
                    <span>•</span>
                    <span>{hotel.district} District</span>
                    <span>•</span>
                    <span>{hotel.state}</span>
                  </div>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {hotel.description}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {hotel.amenities.slice(0, 3).map((a, idx) => (
                    <span key={idx} style={{ fontSize: "0.72rem", background: "var(--bg-tertiary)", padding: "3px 8px", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)" }}>
                      ✓ {a}
                    </span>
                  ))}
                </div>

                {/* Price Breakdown Footer */}
                <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                      ₹{hotel.basePrice} + ₹{hotel.taxes} tax {hotel.discount > 0 ? `- ₹${hotel.discount} off` : ""}
                    </div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--brand-primary)" }}>
                      ₹{finalPayable.toLocaleString("en-IN")} <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>/ night</span>
                    </div>
                  </div>

                  <button className="btn-ocean" style={{ padding: "8px 16px", fontSize: "0.82rem" }}>
                    Select Room
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hotel Reservation Modal */}
      {selectedHotel && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setSelectedHotel(null)}>
          <div
            className="glass-panel animate-scale-up"
            style={{
              width: "100%",
              maxWidth: "600px",
              background: "var(--bg-card-solid)",
              padding: "28px",
              borderRadius: "var(--radius-xl)",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedHotel(null)}
              className="btn-ghost"
              style={{ position: "absolute", top: "14px", right: "14px", padding: "6px", borderRadius: "50%" }}
            >
              <X size={18} />
            </button>

            {!isBookingDone ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--brand-ocean)", fontWeight: 700, textTransform: "uppercase" }}>
                    {selectedHotel.category} Stay Reservation
                  </span>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 800 }}>{selectedHotel.name}</h3>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    {selectedHotel.area}, {selectedHotel.city}, {selectedHotel.state}
                  </div>
                </div>

                {/* Room Selector */}
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>
                    Choose Room Type
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {selectedHotel.rooms.map((room, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedRoom(room)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid",
                          borderColor: selectedRoom?.type === room.type ? "var(--brand-ocean)" : "var(--border-subtle)",
                          background: selectedRoom?.type === room.type ? "rgba(14, 116, 144, 0.08)" : "var(--bg-tertiary)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer"
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>{room.type}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{room.available} rooms remaining</div>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--brand-primary)" }}>
                          ₹{room.price.toLocaleString("en-IN")} / night
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Duration & Guests */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                      Nights
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="input-field"
                      value={nights}
                      onChange={(e) => setNights(Number(e.target.value) || 1)}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                      Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="input-field"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value) || 1)}
                    />
                  </div>
                </div>

                {/* Transparent Price Summary Table */}
                <div style={{ background: "var(--bg-tertiary)", padding: "14px 18px", borderRadius: "var(--radius-lg)", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Base Room Rate ({nights} nights):</span>
                    <span>₹{(selectedRoom?.price * nights).toLocaleString("en-IN")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>GST & Luxury Tax:</span>
                    <span>+₹{Math.round(selectedRoom?.price * nights * 0.18).toLocaleString("en-IN")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>YĀTRI Direct Discount:</span>
                    <span style={{ color: "#10b981" }}>-₹{(selectedHotel.discount * nights).toLocaleString("en-IN")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: 800, borderTop: "1px solid var(--border-subtle)", paddingTop: "8px", marginTop: "4px" }}>
                    <span>Total Amount Payable:</span>
                    <span style={{ color: "var(--brand-primary)" }}>
                      ₹{Math.round(selectedRoom?.price * nights * 1.18 - selectedHotel.discount * nights).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button className="btn-primary" onClick={handleConfirmBooking} style={{ padding: "14px" }}>
                  <CreditCard size={18} />
                  <span>Confirm Stay Booking (Demo)</span>
                </button>
              </div>
            ) : (
              /* Booking Success Receipt */
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.12)", color: "#10b981", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle size={30} />
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Hotel Booking Confirmed! 🏨</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Your reservation at <strong>{selectedHotel.name}</strong> for {nights} night(s) has been secured.
                </p>

                <div style={{ background: "var(--bg-tertiary)", padding: "14px", borderRadius: "var(--radius-md)", textAlign: "left", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div><strong>Room:</strong> {selectedRoom?.type}</div>
                  <div><strong>Check-in:</strong> In 5 days • 02:00 PM</div>
                  <div><strong>Guests:</strong> {guests} Adults</div>
                  <div><strong>Status:</strong> Confirmed (Voucher Generated)</div>
                </div>

                <button className="btn-primary" onClick={() => setSelectedHotel(null)} style={{ padding: "10px" }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
