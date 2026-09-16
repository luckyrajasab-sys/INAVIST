import React from "react";
import { useTheme } from "../../context/ThemeContext";

export const Skeleton = ({
  width = "100%",
  height = "20px",
  borderRadius = "var(--radius-md, 8px)",
  style = {},
  className = ""
}) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
};

export const DestinationCardSkeleton = () => {
  const { isDark } = useTheme();
  return (
    <div
      className="glass-card"
      style={{
        borderRadius: "var(--radius-xl, 16px)",
        overflow: "hidden",
        border: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        height: "380px",
        background: isDark ? "rgba(15, 23, 42, 0.6)" : "#FFFFFF"
      }}
    >
      {/* Image Skeleton */}
      <Skeleton width="100%" height="200px" borderRadius="0" />

      {/* Content Skeleton */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px", flex: 1, justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <Skeleton width="90px" height="18px" borderRadius="9999px" />
            <Skeleton width="50px" height="18px" borderRadius="9999px" />
          </div>
          <Skeleton width="80%" height="22px" style={{ marginBottom: "6px" }} />
          <Skeleton width="95%" height="14px" style={{ marginBottom: "4px" }} />
          <Skeleton width="60%" height="14px" />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}>
          <div>
            <Skeleton width="50px" height="12px" style={{ marginBottom: "4px" }} />
            <Skeleton width="70px" height="20px" />
          </div>
          <Skeleton width="85px" height="32px" borderRadius="var(--radius-full)" />
        </div>
      </div>
    </div>
  );
};

export const TransportOptionCardSkeleton = () => {
  const { isDark } = useTheme();
  return (
    <div
      className="glass-card"
      style={{
        borderRadius: "var(--radius-2xl, 18px)",
        padding: "20px",
        border: "1.5px solid var(--border-subtle)",
        background: isDark ? "rgba(15, 23, 42, 0.6)" : "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        gap: "14px"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Skeleton width="110px" height="24px" borderRadius="9999px" />
        <Skeleton width="70px" height="20px" borderRadius="9999px" />
      </div>

      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
        <Skeleton width="44px" height="44px" borderRadius="12px" />
        <div style={{ flex: 1 }}>
          <Skeleton width="65%" height="20px" style={{ marginBottom: "6px" }} />
          <Skeleton width="45%" height="14px" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "12px", alignItems: "center", padding: "12px", borderRadius: "12px", background: isDark ? "rgba(0,0,0,0.2)" : "#F8FAFC" }}>
        <div>
          <Skeleton width="60px" height="20px" style={{ marginBottom: "4px" }} />
          <Skeleton width="90px" height="14px" />
        </div>
        <Skeleton width="80px" height="14px" />
        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <Skeleton width="60px" height="20px" style={{ marginBottom: "4px" }} />
          <Skeleton width="90px" height="14px" />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Skeleton width="50px" height="12px" style={{ marginBottom: "4px" }} />
          <Skeleton width="80px" height="24px" />
        </div>
        <Skeleton width="130px" height="38px" borderRadius="12px" />
      </div>
    </div>
  );
};

export const HotelCardSkeleton = () => {
  const { isDark } = useTheme();
  return (
    <div
      className="glass-card"
      style={{
        borderRadius: "var(--radius-xl, 16px)",
        padding: "16px",
        border: "1px solid var(--border-subtle)",
        background: isDark ? "rgba(15, 23, 42, 0.6)" : "#FFFFFF",
        display: "flex",
        gap: "16px",
        flexWrap: "wrap"
      }}
    >
      <Skeleton width="220px" height="160px" borderRadius="12px" />
      <div style={{ flex: 1, minWidth: "240px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <Skeleton width="100px" height="18px" borderRadius="9999px" />
            <Skeleton width="50px" height="18px" />
          </div>
          <Skeleton width="75%" height="22px" style={{ marginBottom: "6px" }} />
          <Skeleton width="45%" height="14px" style={{ marginBottom: "10px" }} />
          <div style={{ display: "flex", gap: "6px" }}>
            <Skeleton width="70px" height="22px" borderRadius="6px" />
            <Skeleton width="70px" height="22px" borderRadius="6px" />
            <Skeleton width="70px" height="22px" borderRadius="6px" />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px" }}>
          <Skeleton width="90px" height="26px" />
          <Skeleton width="110px" height="36px" borderRadius="8px" />
        </div>
      </div>
    </div>
  );
};
