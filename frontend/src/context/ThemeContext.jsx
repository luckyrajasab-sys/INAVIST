import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export const ACCENT_PALETTES = [
  { id: "saffron", name: "Royal Saffron", hex: "#EA580C", lightBg: "rgba(234, 88, 12, 0.12)" },
  { id: "emerald", name: "Kerala Emerald", hex: "#16A34A", lightBg: "rgba(22, 163, 74, 0.12)" },
  { id: "indigo", name: "Coromandel Indigo", hex: "#0E7490", lightBg: "rgba(14, 116, 144, 0.12)" },
  { id: "purple", name: "Heritage Purple", hex: "#7C3AED", lightBg: "rgba(124, 58, 237, 0.12)" },
  { id: "golden", name: "Thar Gold", hex: "#D97706", lightBg: "rgba(217, 119, 6, 0.12)" },
  { id: "ruby", name: "Ruby Coral", hex: "#DC2626", lightBg: "rgba(220, 38, 38, 0.12)" },
  { id: "turquoise", name: "Goa Azure", hex: "#0EA5E9", lightBg: "rgba(14, 165, 233, 0.12)" }
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("yatra_theme");
    if (saved) return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem("yatra_accent") || "#EA580C";
  });

  useEffect(() => {
    localStorage.setItem("yatra_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("yatra_accent", accentColor);
    document.documentElement.style.setProperty("--brand-saffron", accentColor);
    document.documentElement.style.setProperty("--brand-primary", accentColor);
  }, [accentColor]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const changeAccentColor = (hex) => {
    setAccentColor(hex);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isDark: theme === "dark",
        accentColor,
        changeAccentColor,
        ACCENT_PALETTES
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
