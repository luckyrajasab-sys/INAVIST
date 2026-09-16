import React from "react";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const PageBackButton = ({ activeTab, tabHistory = [], onGoBack }) => {
  const { isDark } = useTheme();

  if (activeTab === "home") return null;

  // Determine previous tab for tooltip
  const prevTabId = tabHistory.length > 1 ? tabHistory[tabHistory.length - 2] : "home";

  return (
    <div
      style={{
        position: "sticky",
        top: "66px",
        zIndex: 80,
        padding: "8px 24px 0",
        display: "flex",
        alignItems: "center",
        pointerEvents: "none" // Allow clicks through container
      }}
    >
      <button
        onClick={onGoBack}
        aria-label="Go back to previous page"
        title="Go back to last page"
        style={{
          pointerEvents: "auto",
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isDark
            ? "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)"
            : "linear-gradient(135deg, #FFFFFF 0%, #FFF7ED 100%)",
          color: "var(--brand-saffron)",
          border: "2px solid var(--brand-saffron)",
          boxShadow: isDark
            ? "0 4px 14px rgba(0, 0, 0, 0.5), 0 0 12px rgba(234, 88, 12, 0.25)"
            : "0 4px 14px rgba(234, 88, 12, 0.2), 0 2px 6px rgba(0,0,0,0.06)",
          cursor: "pointer",
          transition: "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateX(-3px) scale(1.08)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(234, 88, 12, 0.4)";
          e.currentTarget.style.background = isDark ? "rgba(234, 88, 12, 0.25)" : "#FFEDD5";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateX(0) scale(1)";
          e.currentTarget.style.boxShadow = isDark
            ? "0 4px 14px rgba(0, 0, 0, 0.5), 0 0 12px rgba(234, 88, 12, 0.25)"
            : "0 4px 14px rgba(234, 88, 12, 0.2), 0 2px 6px rgba(0,0,0,0.06)";
          e.currentTarget.style.background = isDark
            ? "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)"
            : "linear-gradient(135deg, #FFFFFF 0%, #FFF7ED 100%)";
        }}
      >
        <ArrowLeft size={20} strokeWidth={2.8} />
      </button>
    </div>
  );
};
