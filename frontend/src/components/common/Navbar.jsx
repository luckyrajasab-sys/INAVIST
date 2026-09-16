import React, { useState, useRef, useEffect } from "react";
import {
  Globe,
  Sun,
  Moon,
  ShieldAlert,
  User,
  Search,
  CheckCircle,
  Menu,
  ChevronDown,
  ArrowLeft,
  Sparkles,
  Check
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { YatriLogo } from "../branding/YatriLogo";

import { useRewards } from "../../context/RewardsContext";
import { api } from "../../api/client";

export const Navbar = ({ onOpenSOS, onSearchClick, onToggleSidebar, setActiveTab, activeTab, onGoBack, canGoBack }) => {
  const { currentLang, languagesList, changeLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, setIsAuthModalOpen } = useAuth();
  const { totalPoints } = useRewards();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState(true);
  const langDropdownRef = useRef(null);

  useEffect(() => {
    const checkHealth = () => {
      api.health.check().then((res) => {
        setBackendOnline(res?.success === true || res?.status === "healthy");
      }).catch(() => {
        setBackendOnline(false);
      });
    };
    checkHealth();
    const interval = setInterval(checkHealth, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    if (isLangOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isLangOpen]);

  const currentLangObj = (languagesList && languagesList.find((l) => l.code === currentLang)) || (languagesList && languagesList[0]) || {
    code: "en",
    name: "English",
    label: "English",
    nativeName: "English",
    native: "English"
  };

  const navItems = [
    { id: "explore", label: t("navExplore") || "Destinations" },
    { id: "transport", label: t("navTransport") || "Transport" },
    { id: "planner", label: t("navPlanner") || "Smart Planner" },
    { id: "rewards", label: "Rewards" },
    { id: "hotels", label: "Hotels" }
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        height: "60px",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        background: "var(--bg-glass)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "0 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      {/* Left: Brand & Mobile Toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          className="btn-ghost"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation"
          style={{ padding: "6px", display: "flex", alignItems: "center" }}
        >
          <Menu size={22} />
        </button>

        <div onClick={() => setActiveTab("home")} style={{ cursor: "pointer" }}>
          <YatriLogo size="medium" />
        </div>
      </div>

      {/* Center Nav Links (Desktop) with Smooth Text Color & State Transitions */}
      <div
        style={{
          display: "none",
          alignItems: "center",
          gap: "4px",
          background: "var(--bg-tertiary)",
          padding: "4px 6px",
          borderRadius: "var(--radius-full)",
          border: "1px solid var(--border-subtle)"
        }}
        className="desktop-nav-center"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                border: item.isGem && !isActive ? "1px solid rgba(139, 92, 246, 0.3)" : "none",
                background: isActive
                  ? (isDark ? "#FFFFFF" : "#090E17")
                  : item.isGem
                  ? (isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(243, 232, 255, 0.7)")
                  : "transparent",
                color: isActive
                  ? (isDark ? "#090E17" : "#FFFFFF")
                  : item.isGem
                  ? "var(--status-gem)"
                  : "var(--text-secondary)",
                fontWeight: isActive ? 800 : item.isGem ? 700 : 600,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "color 0.2s ease, background-color 0.2s ease, transform 0.15s ease"
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--text-primary)";
                  e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = item.isGem ? "var(--status-gem)" : "var(--text-secondary)";
                  e.currentTarget.style.background = item.isGem
                    ? (isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(243, 232, 255, 0.7)")
                    : "transparent";
                }
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Right: Unified Utility Cluster */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Points Quick Badge */}
        <button
          onClick={() => setActiveTab("rewards")}
          style={{
            height: "36px",
            padding: "0 12px",
            background: isDark ? "rgba(37, 99, 235, 0.18)" : "rgba(37, 99, 235, 0.10)",
            color: "var(--brand-primary, #2563EB)",
            border: "1px solid rgba(37, 99, 235, 0.25)",
            borderRadius: "var(--radius-full)",
            fontWeight: 800,
            fontSize: "0.80rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            transition: "transform var(--transition-fast)"
          }}
          aria-label="INAVIST Rewards"
          title="View INAVIST Travel Rewards"
        >
          <Sparkles size={14} />
          <span>{totalPoints.toLocaleString("en-IN")} Pts</span>
        </button>

        {/* SOS Emergency Button */}
        <button
          onClick={onOpenSOS}
          style={{
            height: "36px",
            padding: "0 14px",
            background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "var(--radius-full)",
            fontWeight: 800,
            fontSize: "0.82rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 8px rgba(220, 38, 38, 0.35)",
            transition: "transform var(--transition-fast)"
          }}
          aria-label="SOS Emergency"
        >
          <ShieldAlert size={16} />
          <span>SOS</span>
        </button>

        {/* Language Selector Dropdown */}
        <div style={{ position: "relative" }} ref={langDropdownRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            style={{
              height: "36px",
              padding: "0 12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: isLangOpen ? "var(--bg-card-hover)" : "var(--bg-tertiary)",
              border: `1px solid ${isLangOpen ? "var(--brand-saffron)" : "var(--border-subtle)"}`,
              borderRadius: "var(--radius-full)",
              color: "var(--text-primary)",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all var(--transition-fast)"
            }}
            aria-label="Select Language"
            aria-expanded={isLangOpen}
            aria-haspopup="listbox"
          >
            <Globe size={15} style={{ color: "var(--brand-saffron)" }} />
            <span>{currentLangObj.nativeName || currentLangObj.native || currentLangObj.name || currentLangObj.label || "English"}</span>
            <ChevronDown size={13} style={{ transform: isLangOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
          </button>

          {isLangOpen && (
            <div
              className="glass-card"
              role="listbox"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "200px",
                maxHeight: "320px",
                overflowY: "auto",
                padding: "6px",
                zIndex: 999,
                borderRadius: "var(--radius-md)",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
                background: isDark ? "rgba(18, 24, 38, 0.95)" : "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "2px"
              }}
            >
              {languagesList.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderRadius: "var(--radius-sm)",
                      border: "none",
                      background: isSelected ? "var(--brand-saffron-light)" : "transparent",
                      color: isSelected ? "var(--brand-saffron)" : "var(--text-primary)",
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontSize: "0.84rem", fontWeight: isSelected ? 700 : 600 }}>
                        {lang.nativeName || lang.native || lang.name || lang.label}
                      </span>
                      <span style={{ fontSize: "0.72rem", color: isSelected ? "var(--brand-saffron)" : "var(--text-muted)", opacity: isSelected ? 0.9 : 0.75 }}>
                        {lang.name || lang.label}
                      </span>
                    </div>
                    {isSelected && (
                      <Check size={14} style={{ color: "var(--brand-saffron)", strokeWidth: 3 }} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Backend Connection Indicator */}
        <div
          title={backendOnline ? "Backend Live & Connected (Express + MongoDB)" : "Backend Offline (Local Cache Mode)"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 11px",
            borderRadius: "var(--radius-full)",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.3px",
            background: backendOnline
              ? (isDark ? "rgba(16, 185, 129, 0.14)" : "rgba(16, 185, 129, 0.1)")
              : (isDark ? "rgba(239, 68, 68, 0.14)" : "rgba(239, 68, 68, 0.1)"),
            border: `1px solid ${backendOnline ? "rgba(16, 185, 129, 0.35)" : "rgba(239, 68, 68, 0.35)"}`,
            color: backendOnline ? "#10B981" : "#EF4444",
            cursor: "default",
            userSelect: "none"
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: backendOnline ? "#10B981" : "#EF4444",
              boxShadow: backendOnline ? "0 0 8px #10B981" : "none"
            }}
          />
          <span style={{ display: "inline" }}>
            {backendOnline ? "Live DB" : "Offline"}
          </span>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "var(--radius-full)",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all var(--transition-fast)"
          }}
          aria-label={isDark ? "Switch to Bright Mode" : "Switch to Dark Mode"}
          title={isDark ? "Bright Mode" : "Dark Mode"}
        >
          {isDark ? <Sun size={17} color="#EA580C" /> : <Moon size={17} />}
        </button>

        {/* User Profile / Sign In */}
        {isAuthenticated ? (
          <div
            onClick={() => setActiveTab("profile")}
            style={{
              height: "36px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              padding: "2px 10px 2px 3px",
              borderRadius: "var(--radius-full)",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)"
            }}
          >
            <img
              src="/default-avatar.png"
              alt={user.name}
              style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
            />
            <div style={{ display: "none", flexDirection: "column", marginRight: "2px" }} className="desktop-user-label">
              <span style={{ fontSize: "0.82rem", fontWeight: 700, lineHeight: 1 }}>{user.name.split(" ")[0]}</span>
              <span style={{ fontSize: "0.68rem", color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "2px" }}>
                <CheckCircle size={9} /> {user.role === "admin" ? "Admin" : "Verified"}
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            style={{
              height: "36px",
              padding: "0 18px",
              fontSize: "0.84rem",
              fontWeight: 700,
              background: isDark ? "#FFFFFF" : "#090E17",
              color: isDark ? "#090E17" : "#FFFFFF",
              border: "none",
              borderRadius: "var(--radius-full)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.18)"
            }}
          >
            <User size={15} />
            <span>Sign In</span>
          </button>
        )}
      </div>

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav-center {
            display: flex !important;
          }
          .desktop-user-label {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
