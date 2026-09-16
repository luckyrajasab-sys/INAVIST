import React from "react";
import { Home, Compass, MapPin, CalendarCheck, ShieldAlert, Award, FolderDown } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export const MobileDock = ({ activeTab, setActiveTab, onOpenSOS }) => {
  const { t } = useLanguage();

  const dockItems = [
    { id: "home", label: t("navHome"), icon: Home },
    { id: "vault", label: "Vault", icon: FolderDown },
    { id: "explore", label: t("navExplore"), icon: Compass },
    { id: "planner", label: "Planner", icon: CalendarCheck },
    { id: "history", label: "Passport", icon: Award }
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 900,
        background: "var(--bg-glass-strong)",
        backdropFilter: "var(--blur-strong)",
        WebkitBackdropFilter: "var(--blur-strong)",
        borderRadius: "var(--radius-full)",
        border: "1px solid var(--border-glass)",
        boxShadow: "var(--shadow-xl)",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        maxWidth: "92vw"
      }}
      className="mobile-bottom-dock"
    >
      {dockItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              background: isActive ? "var(--brand-primary-light)" : "transparent",
              color: isActive ? "var(--brand-primary)" : "var(--text-secondary)",
              border: "none",
              borderRadius: "var(--radius-full)",
              padding: "6px 12px",
              cursor: "pointer",
              transition: "all var(--transition-fast)"
            }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span style={{ fontSize: "0.68rem", fontWeight: isActive ? 700 : 500 }}>
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Floating SOS button */}
      <button
        onClick={onOpenSOS}
        style={{
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "42px",
          height: "42px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
          cursor: "pointer",
          marginLeft: "4px"
        }}
        aria-label="SOS Alarm"
      >
        <ShieldAlert size={20} />
      </button>

      <style>{`
        @media (min-width: 1024px) {
          .mobile-bottom-dock {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};
