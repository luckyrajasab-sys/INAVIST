import React, { createContext, useContext, useState, useEffect } from "react";
import { languagesList, translations } from "../data/translations";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("yatra_lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("yatra_lang", currentLang);
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const t = (key) => {
    const langDict = translations[currentLang] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLang(langCode);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        languagesList,
        t,
        changeLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
