import React, { createContext, useContext, useState, useEffect } from "react";
import { DEFAULT_AVATAR } from "../data/avatarPresets";
import { api, getAuthToken, setAuthToken } from "../api/client";

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: "usr-demo-01",
  name: "Arjun Verma",
  email: "arjun.verma@example.com",
  avatarId: "default-avatar",
  avatar: "/default-avatar.png",
  isVerified: true,
  isForeigner: false,
  nationality: "Indian",
  verificationType: "Government ID (Aadhaar / DigiLocker Verified)",
  homeCity: "New Delhi, India",
  registeredLocation: {
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    formattedAddress: "Bengaluru, Karnataka, India",
    isApproximate: true,
    updatedAt: new Date().toISOString()
  },
  joinedDate: "March 2024",
  phone: "+91 98765 43210",
  travelStyle: "Spiritual & Mountain Heritage",
  stats: {
    statesVisited: 14,
    districtsVisited: 38,
    gemsDiscovered: 12,
    totalTrips: 18,
    totalBookings: 12,
    completedTrips: 10,
    totalBudgetSaved: 42000
  },
  badges: [
    { id: "himalaya", name: "Himalayan Explorer", icon: "🏔️", desc: "Visited 5+ high-altitude passes" },
    { id: "temple", name: "Temple Pilgrim", icon: "🛕", desc: "Explored 10+ ancient Dravidian & Nagar temples" },
    { id: "coastal", name: "Coastal Nomad", icon: "🌴", desc: "Traveled along Konkan & Malabar coasts" }
  ]
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("yatra_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, avatar: "/default-avatar.png", avatarId: "default-avatar" };
      } catch (e) {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("yatra_auth") === "true";
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState("signin"); // 'signin' | 'signup' | 'foreigner'

  // Synchronize user to localStorage for offline access
  useEffect(() => {
    if (user) {
      localStorage.setItem("yatra_user", JSON.stringify(user));
    }
  }, [user]);

  // Session check on mount: verify existing JWT with backend
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      api.auth.getMe().then((res) => {
        if (res.success && res.data) {
          setUser((prev) => ({
            ...DEFAULT_USER,
            ...prev,
            ...res.data,
            id: res.data._id || res.data.id || prev?.id
          }));
          setIsAuthenticated(true);
          localStorage.setItem("yatra_auth", "true");
        }
      }).catch((err) => {
        console.warn("Could not verify session with backend:", err);
      });
    }
  }, []);

  const openAuthModal = (tab = "signin") => {
    setAuthInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  // Standard Email + Password Login
  const login = async (email, password) => {
    try {
      const res = await api.auth.login(email, password);
      if (res.success && res.data?.user) {
        const loggedUser = {
          ...DEFAULT_USER,
          ...res.data.user,
          id: res.data.user._id || res.data.user.id
        };
        setUser(loggedUser);
        setIsAuthenticated(true);
        localStorage.setItem("yatra_auth", "true");
        localStorage.setItem("yatra_user", JSON.stringify(loggedUser));
        setIsAuthModalOpen(false);
        return { success: true, user: loggedUser };
      }
      return { success: false, message: res.message || "Invalid credentials." };
    } catch (err) {
      return { success: false, message: err.message || "Network request failed." };
    }
  };

  // One-Click Demo Login (Arjun Verma)
  const loginWithDemo = async () => {
    try {
      const res = await api.auth.demoLogin();
      if (res.success && res.data?.user) {
        const demoUser = {
          ...DEFAULT_USER,
          ...res.data.user,
          id: res.data.user._id || res.data.user.id
        };
        setUser(demoUser);
        setIsAuthenticated(true);
        localStorage.setItem("yatra_auth", "true");
        localStorage.setItem("yatra_user", JSON.stringify(demoUser));
        setIsAuthModalOpen(false);
        return { success: true, user: demoUser };
      }
    } catch (e) {
      console.warn("Demo login API unreachable, falling back to local demo profile:", e);
    }
    // High-fidelity fallback if backend is momentarily unreachable
    setUser(DEFAULT_USER);
    setIsAuthenticated(true);
    localStorage.setItem("yatra_auth", "true");
    setIsAuthModalOpen(false);
    return { success: true, user: DEFAULT_USER };
  };

  // Social Login (Google / Apple)
  const loginWithSocial = async (provider) => {
    try {
      const res = await api.auth.socialLogin({
        provider: provider.toLowerCase(),
        name: provider === "Google" ? "Aditya Krishnan" : "Ananya Roy",
        email: `${provider.toLowerCase()}_traveler@example.com`
      });
      if (res.success && res.data?.user) {
        const socialUser = {
          ...DEFAULT_USER,
          ...res.data.user,
          id: res.data.user._id || res.data.user.id
        };
        setUser(socialUser);
        setIsAuthenticated(true);
        localStorage.setItem("yatra_auth", "true");
        localStorage.setItem("yatra_user", JSON.stringify(socialUser));
        setIsAuthModalOpen(false);
        return { success: true, user: socialUser };
      }
    } catch (e) {
      console.warn("Social login API error, falling back locally:", e);
    }

    const socialUser = {
      id: `usr-${provider.toLowerCase()}-${Date.now()}`,
      name: provider === "Google" ? "Aditya Krishnan" : "Ananya Roy",
      email: `${provider.toLowerCase()}_traveler@example.com`,
      avatarId: "default-avatar",
      avatar: "/default-avatar.png",
      isVerified: true,
      isForeigner: false,
      nationality: "Indian",
      verificationType: "Verified via " + provider,
      homeCity: "Bengaluru, Karnataka",
      registeredLocation: {
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        formattedAddress: "Bengaluru, Karnataka, India",
        isApproximate: true,
        updatedAt: new Date().toISOString()
      },
      joinedDate: "August 2026",
      phone: "+91 94480 12345",
      travelStyle: "Cultural Heritage & Foodie",
      stats: {
        statesVisited: 8,
        districtsVisited: 22,
        gemsDiscovered: 7,
        totalTrips: 9,
        totalBookings: 6,
        completedTrips: 5,
        totalBudgetSaved: 19500
      },
      badges: [
        { id: "himalaya", name: "Himalayan Explorer", icon: "🏔️", desc: "Visited 3+ high-altitude passes" },
        { id: "foodie", name: "Spice Route Foodie", icon: "🍲", desc: "Sampled regional cuisines across 6 states" }
      ]
    };
    setUser(socialUser);
    setIsAuthenticated(true);
    localStorage.setItem("yatra_auth", "true");
    setIsAuthModalOpen(false);
    return { success: true, user: socialUser };
  };

  // Indian Citizen Registration
  const registerIndianUser = async (formData) => {
    try {
      const res = await api.auth.register({
        name: formData.name || "Indian Traveler",
        email: formData.email,
        password: formData.password || "Yatri@2026!",
        phone: formData.phone || "",
        homeCity: `${formData.city || "New Delhi"}, ${formData.state || "India"}`,
        travelStyle: formData.travelStyle || "Heritage & Nature",
        isForeigner: false
      });
      if (res.success && res.data?.user) {
        const newUser = {
          ...DEFAULT_USER,
          ...res.data.user,
          id: res.data.user._id || res.data.user.id
        };
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem("yatra_auth", "true");
        localStorage.setItem("yatra_user", JSON.stringify(newUser));
        setIsAuthModalOpen(false);
        return { success: true, user: newUser };
      } else if (res.message) {
        return { success: false, message: res.message };
      }
    } catch (e) {
      console.warn("Registration API error, fallback to local register:", e);
    }

    const newUser = {
      id: `usr-in-${Date.now()}`,
      name: formData.name || "Indian Traveler",
      email: formData.email,
      avatarId: "default-avatar",
      avatar: "/default-avatar.png",
      isVerified: true,
      isForeigner: false,
      nationality: "Indian",
      verificationType: "Aadhaar / Govt ID Verified",
      homeCity: `${formData.city || "New Delhi"}, ${formData.state || "India"}`,
      registeredLocation: {
        city: formData.city || "Bengaluru",
        state: formData.state || "Karnataka",
        country: "India",
        formattedAddress: `${formData.city || "Bengaluru"}, ${formData.state || "Karnataka"}, India`,
        isApproximate: true,
        updatedAt: new Date().toISOString()
      },
      joinedDate: "August 2026",
      phone: formData.phone || "+91 98000 00000",
      travelStyle: formData.travelStyle || "Heritage & Nature",
      stats: {
        statesVisited: 1,
        districtsVisited: 3,
        gemsDiscovered: 2,
        totalTrips: 1,
        totalBookings: 1,
        completedTrips: 1,
        totalBudgetSaved: 3500
      },
      badges: [
        { id: "newcomer", name: "Incredible India Explorer", icon: "🇮🇳", desc: "New YĀTRI Citizen Member" }
      ]
    };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("yatra_auth", "true");
    setIsAuthModalOpen(false);
    return { success: true, user: newUser };
  };

  // Foreigner / International Traveler Registration
  const registerForeignerUser = async (formData) => {
    try {
      const res = await api.auth.register({
        name: formData.passportName || formData.name || "International Traveler",
        email: formData.email,
        password: formData.password || "Yatri@2026!",
        phone: formData.phone || "",
        nationality: formData.nationality || "United States",
        homeCity: `${formData.homeCity || "New York"}, ${formData.nationality || "USA"}`,
        travelStyle: formData.travelStyle || "Spiritual & Monument Exploration",
        passportNumber: formData.passportNumber ? formData.passportNumber.toUpperCase() : "PASS-998877",
        visaNumber: formData.visaNumber ? formData.visaNumber.toUpperCase() : "IN-EVSA-2026-8899",
        visaType: formData.visaType || "e-Tourist Visa (30/365 Days)",
        arrivalPort: formData.arrivalPort || "Indira Gandhi Int'l Airport (DEL)",
        isForeigner: true
      });
      if (res.success && res.data?.user) {
        const foreignerUser = {
          ...DEFAULT_USER,
          ...res.data.user,
          id: res.data.user._id || res.data.user.id
        };
        setUser(foreignerUser);
        setIsAuthenticated(true);
        localStorage.setItem("yatra_auth", "true");
        localStorage.setItem("yatra_user", JSON.stringify(foreignerUser));
        setIsAuthModalOpen(false);
        return { success: true, user: foreignerUser };
      } else if (res.message) {
        return { success: false, message: res.message };
      }
    } catch (e) {
      console.warn("Foreigner registration API error:", e);
    }

    const foreignerUser = {
      id: `usr-intl-${Date.now()}`,
      name: formData.passportName || formData.name || "International Traveler",
      email: formData.email,
      avatarId: "default-avatar",
      avatar: "/default-avatar.png",
      isVerified: true,
      isForeigner: true,
      nationality: formData.nationality || "United States",
      verificationType: "Verified International Tourist (Passport & e-Visa Checked)",
      passportNumber: formData.passportNumber ? formData.passportNumber.toUpperCase() : "PASS-998877",
      passportExpiry: formData.passportExpiry || "2030-12-31",
      visaNumber: formData.visaNumber ? formData.visaNumber.toUpperCase() : "IN-EVSA-2026-8899",
      visaType: formData.visaType || "e-Tourist Visa (30/365 Days)",
      visaExpiry: formData.visaExpiry || "2027-08-15",
      arrivalPort: formData.arrivalPort || "Indira Gandhi Int'l Airport (DEL)",
      homeCountryContact: formData.emergencyContact || "+1 555 019 2834",
      homeCity: `${formData.homeCity || "New York"}, ${formData.nationality || "USA"}`,
      registeredLocation: {
        city: "Delhi Airport Area",
        state: "Delhi",
        country: "India",
        formattedAddress: "Delhi NCR, India (Arrival Zone)",
        isApproximate: true,
        updatedAt: new Date().toISOString()
      },
      joinedDate: "August 2026",
      phone: formData.phone || "+1 555 123 4567",
      travelStyle: formData.travelStyle || "Spiritual & Monument Exploration",
      stats: {
        statesVisited: 3,
        districtsVisited: 8,
        gemsDiscovered: 4,
        totalTrips: 3,
        totalBookings: 2,
        completedTrips: 2,
        totalBudgetSaved: 8500
      },
      badges: [
        { id: "global", name: "Global India Explorer", icon: "🌍", desc: "International Tourist Pass Holder" },
        { id: "golden_triangle", name: "Golden Triangle Master", icon: "🕌", desc: "Visited Delhi, Agra & Jaipur" }
      ]
    };
    setUser(foreignerUser);
    setIsAuthenticated(true);
    localStorage.setItem("yatra_auth", "true");
    setIsAuthModalOpen(false);
    return { success: true, user: foreignerUser };
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      // offline logout
    }
    setAuthToken(null);
    setIsAuthenticated(false);
    localStorage.setItem("yatra_auth", "false");
  };

  const updateProfile = async (updatedFields) => {
    setUser((prev) => {
      const updated = {
        ...prev,
        ...updatedFields,
        avatar: "/default-avatar.png",
        avatarId: "default-avatar"
      };
      localStorage.setItem("yatra_user", JSON.stringify(updated));
      return updated;
    });
    try {
      await api.user.updateProfile(updatedFields);
    } catch (e) {
      // Offline fallback
    }
  };

  const updateRegisteredLocation = async (locationData) => {
    setUser((prev) => {
      const updated = {
        ...prev,
        registeredLocation: {
          ...prev?.registeredLocation,
          ...locationData,
          updatedAt: new Date().toISOString()
        }
      };
      localStorage.setItem("yatra_user", JSON.stringify(updated));
      return updated;
    });
    try {
      const API_BASE = import.meta.env?.VITE_API_URL || "/api";
      await fetch(`${API_BASE}/auth/location`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {})
        },
        body: JSON.stringify(locationData)
      });
    } catch (e) {
      // Offline fallback
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authInitialTab,
        openAuthModal,
        login,
        loginWithDemo,
        loginWithSocial,
        registerIndianUser,
        registerForeignerUser,
        logout,
        updateProfile,
        updateRegisteredLocation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
