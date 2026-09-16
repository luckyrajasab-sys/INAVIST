import React from "react";

export const YatriLogo = ({ variant = "horizontal", size = "medium", isDark = false }) => {
  const iconSizes = {
    small: 28,
    medium: 38,
    large: 54
  };

  const currentSize = iconSizes[size] || iconSizes.medium;

  // Minimalist 'Y' journey path combined with location pin & compass route
  const LogoIcon = () => (
    <svg
      width={currentSize}
      height={currentSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="yatriGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0E7490" />
          <stop offset="50%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        <filter id="yatriGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#F97316" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Rounded Hexagonal / Shield Background */}
      <rect x="5" y="5" width="90" height="90" rx="26" fill="#0B1F33" />

      {/* Journey Path forming the 'Y' Road */}
      <path
        d="M26 24 L50 56 M74 24 L50 56 M50 56 L50 82"
        stroke="url(#yatriGradient)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#yatriGlow)"
      />

      {/* Center Navigation Compass Pin */}
      <circle cx="50" cy="56" r="6" fill="#FAFAF8" />

      {/* Origin Waypoint Dot */}
      <circle cx="26" cy="24" r="4.5" fill="#14B8A6" />

      {/* Destination Waypoint Pin */}
      <circle cx="74" cy="24" r="5" fill="#F97316" />
    </svg>
  );

  if (variant === "icon") {
    return <LogoIcon />;
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", userSelect: "none" }}>
      <LogoIcon />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 900,
            fontSize: size === "large" ? "1.9rem" : size === "small" ? "1.1rem" : "1.45rem",
            letterSpacing: "0.06em",
            lineHeight: 1,
            color: "var(--text-primary)"
          }}
        >
          INAVIST
        </div>
        <div
          style={{
            fontSize: size === "large" ? "0.78rem" : "0.64rem",
            color: "var(--text-muted)",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginTop: "3px"
          }}
        >
          India • Travel • Tourism
        </div>
      </div>
    </div>
  );
};
