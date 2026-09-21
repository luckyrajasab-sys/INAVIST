import React, { useState, useEffect } from "react";
import {
  Home,
  Compass,
  Search,
  CalendarCheck,
  Ticket,
  PhoneCall,
  ShieldAlert,
  FolderDown,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User,
  Settings,
  LogOut,
  X,
  ChevronRight,
  MapPin,
  Building,
  Car,
  Layers,
  Award
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { usePlanner } from "../../context/PlannerContext";
import { useTheme } from "../../context/ThemeContext";
import { useRewards } from "../../context/RewardsContext";

export const Sidebar = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  onToggleCollapse,
  isOpenMobile,
  onCloseMobile
}) => {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout, setIsAuthModalOpen } = useAuth();
  const { totalPoints } = useRewards();
  const { isDark } = useTheme();

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  // Section 1: Travel (includes Cab Booking & Hotel Booking)
  const travelItems = [
    { id: "home", label: "Home", icon: Home, badge: null },
    { id: "explore", label: "Explore Destinations", icon: Compass, badge: "170+" },
    { id: "transport", label: "Search & Find Routes", icon: Search, badge: "All Modes" },
    { id: "hotels", label: "Hotels & Stays", icon: Building, badge: "Verified", badgeColor: "#0EA5E9" },
    { id: "cabs", label: "Cab Booking", icon: Car, badge: "Instant", badgeColor: "#16A34A" },
    { id: "planner", label: "My Trips & Planner", icon: CalendarCheck, badge: "AI" },
    { id: "booking-history", label: "Bookings & E-Tickets", icon: Ticket, badge: "Verified", badgeColor: "#2563EB" }
  ];

  // Section 2: Communication & Safety (includes Travel Vault)
  const safetyItems = [
    { id: "companions", label: "Emergency Contacts & Trips", icon: PhoneCall, badge: null },
    { id: "safety", label: "SOS Emergency Center", icon: ShieldAlert, badge: "SOS", badgeColor: "#DC2626" },
    { id: "vault", label: "Travel Vault (Offline Packs)", icon: FolderDown, badge: "Offline", badgeColor: "#16A34A" },
    { id: "govTourism", label: "Safety & Tourism Center", icon: ShieldCheck, badge: "Official", badgeColor: "#7C3AED" }
  ];

  // Section 3: Payments (UPI Payments & Rewards)
  const paymentItems = [
    { id: "upi-payments", label: "UPI Payments", icon: Smartphone, badge: "NPCI", badgeColor: "#16A34A" },
    { id: "rewards", label: "INAVIST Rewards", icon: Sparkles, badge: `${totalPoints.toLocaleString("en-IN")} Pts`, badgeColor: "#EA580C" }
  ];

  // Section 4: Account
  const accountItems = [
    { id: "profile", label: "Profile & Avatar", icon: User, badge: user?.isForeigner ? "e-Visa" : "Citizen" },
    { id: "settings", label: "Settings & Themes", icon: Settings, badge: null },
    ...(user?.role === "admin" ? [{ id: "admin", label: "Admin Portal", icon: ShieldCheck, badge: "Admin", badgeColor: "#DC2626" }] : [])
  ];

  const renderSectionHeader = (title) => {
    if (isCollapsed) return null;
    return (
      <div
        style={{
          fontSize: "0.66rem",
          fontWeight: 800,
          color: "var(--text-muted)",
          letterSpacing: "0.07em",
          padding: "8px 12px 4px",
          textTransform: "uppercase",
          transition: "opacity 0.2s ease"
        }}
      >
        {title}
      </div>
    );
  };

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleSelectTab(item.id)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: isCollapsed ? "0" : "12px",
          justifyContent: isCollapsed ? "center" : "flex-start",
          padding: isCollapsed ? "10px" : "9px 12px",
          borderRadius: isCollapsed ? "var(--radius-md, 8px)" : "var(--radius-lg, 10px)",
          border: "none",
          borderLeft: isCollapsed ? "none" : isActive ? "3px solid var(--brand-primary, #2563EB)" : "3px solid transparent",
          background: isActive ? (isDark ? "rgba(37,99,235,0.18)" : "rgba(37,99,235,0.08)") : "transparent",
          color: isActive ? "var(--brand-primary, #2563EB)" : "var(--text-secondary)",
          fontWeight: isActive ? 800 : 500,
          fontSize: "0.86rem",
          cursor: "pointer",
          transition: "background-color 0.15s ease, color 0.15s ease, transform 0.15s ease, border-color 0.15s ease",
          transform: "translateZ(0)"
        }}
        title={isCollapsed ? item.label : undefined}
      >
        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} color={isActive ? "var(--brand-primary, #2563EB)" : "currentColor"} />
        {!isCollapsed && (
          <>
            <span style={{ flex: 1, textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.label}
            </span>
            {item.badge && (
              <span
                style={{
                  fontSize: "0.66rem",
                  fontWeight: 800,
                  padding: "2px 7px",
                  borderRadius: "var(--radius-full, 9999px)",
                  background: item.badgeColor ? `${item.badgeColor}18` : isActive ? "rgba(37,99,235,0.18)" : "var(--bg-tertiary)",
                  color: item.badgeColor || (isActive ? "var(--brand-primary, #2563EB)" : "var(--text-muted)")
                }}
              >
                {item.badge}
              </span>
            )}
            {isActive && <ChevronRight size={14} opacity={0.6} />}
          </>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Animated Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 998,
          background: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          opacity: isOpenMobile ? 1 : 0,
          visibility: isOpenMobile ? "visible" : "hidden",
          pointerEvents: isOpenMobile ? "auto" : "none",
          transition: "opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.28s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
        className="mobile-backdrop-overlay"
        onClick={onCloseMobile}
      />

      {/* Responsive Animated Sidebar Aside */}
      <aside
        style={{
          position: "fixed",
          top: "60px",
          left: 0,
          bottom: 0,
          width: isCollapsed ? "88px" : "280px",
          background: isDark ? "rgba(10, 15, 29, 0.96)" : "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRight: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          padding: isCollapsed ? "16px 10px" : "18px 14px",
          zIndex: 999,
          overflowY: "auto",
          boxShadow: isOpenMobile ? "0 0 50px rgba(0, 0, 0, 0.5)" : "none",
          transition: "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), width 0.24s cubic-bezier(0.16, 1, 0.3, 1), padding 0.24s ease, box-shadow 0.3s ease"
        }}
        className={`app-sidebar-responsive ${isOpenMobile ? "mobile-drawer-open" : "mobile-drawer-closed"}`}
      >
        {/* Mobile Header with Close button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "12px",
            borderBottom: "1px solid var(--border-subtle)",
            marginBottom: "8px"
          }}
          className="mobile-sidebar-header"
        >
          <div style={{ fontSize: "0.92rem", fontWeight: 900, color: "var(--brand-primary, #2563EB)" }}>
            INAVIST Navigation
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px", flex: 1 }}>
          {/* SECTION 1: TRAVEL (With Cab Booking & Hotels) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {renderSectionHeader("TRAVEL")}
            {travelItems.map(renderNavItem)}
          </div>

          {/* SECTION 2: COMMUNICATION & SAFETY */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {renderSectionHeader("COMMUNICATION & SAFETY")}
            {safetyItems.map(renderNavItem)}
          </div>

          {/* SECTION 3: PAYMENTS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {renderSectionHeader("PAYMENTS")}
            {paymentItems.map(renderNavItem)}
          </div>

          {/* SECTION 4: ACCOUNT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {renderSectionHeader("ACCOUNT")}
            {accountItems.map(renderNavItem)}
          </div>
        </div>

        {/* Bottom Sign In / Out */}
        <div style={{ paddingTop: "14px", borderTop: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: "8px" }}>
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                if (onCloseMobile) onCloseMobile();
              }}
              className="btn-ghost"
              style={{
                width: "100%",
                justifyContent: isCollapsed ? "center" : "flex-start",
                color: "#DC2626",
                fontSize: "0.85rem",
                gap: "8px"
              }}
              title={isCollapsed ? "Sign Out" : undefined}
            >
              <LogOut size={16} />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          ) : (
            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                if (onCloseMobile) onCloseMobile();
              }}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "0.85rem"
              }}
            >
              {!isCollapsed ? <span>Sign In / Demo</span> : <User size={18} />}
            </button>
          )}
        </div>

        <style>{`
          /* Mobile default: off-canvas drawer */
          @media (max-width: 1023px) {
            .app-sidebar-responsive.mobile-drawer-closed {
              transform: translateX(-100%) !important;
            }
            .app-sidebar-responsive.mobile-drawer-open {
              transform: translateX(0) !important;
            }
          }

          /* Desktop: permanent fixed with collapse animation */
          @media (min-width: 1024px) {
            .app-sidebar-responsive {
              transform: translateX(0) !important;
              box-shadow: none !important;
            }
            .mobile-sidebar-header {
              display: none !important;
            }
            .mobile-backdrop-overlay {
              display: none !important;
            }
          }
        `}</style>
      </aside>
    </>
  );
};
