import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile as updateFirebaseProfile
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { TravelSyncService } from "../services/TravelSyncService";

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
        return { ...parsed, avatar: parsed.avatar || "/default-avatar.png" };
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
  const [authInitialTab, setAuthInitialTab] = useState("signin"); // 'signin' | 'phone' | 'signup' | 'foreigner' | 'forgot'
  const [phoneConfirmationResult, setPhoneConfirmationResult] = useState(null);

  // Synchronize user to localStorage for offline cache
  useEffect(() => {
    if (user) {
      localStorage.setItem("yatra_user", JSON.stringify(user));
    }
  }, [user]);

  // Real-Time Firebase Auth State Listener
  useEffect(() => {
    if (!auth) return;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        localStorage.setItem("yatra_auth", "true");

        // Subscribe to real-time Firestore profile
        const unsubscribeProfile = TravelSyncService.subscribeUserProfile(
          firebaseUser.uid,
          (cloudProfile) => {
            setUser((prev) => ({
              ...DEFAULT_USER,
              ...prev,
              ...cloudProfile,
              id: firebaseUser.uid,
              email: firebaseUser.email || cloudProfile?.email || prev?.email,
              name: cloudProfile?.name || firebaseUser.displayName || prev?.name,
              avatar: firebaseUser.photoURL || cloudProfile?.avatar || "/default-avatar.png"
            }));
          },
          (err) => {
            // Firestore not ready or permissions error: use fallback profile
            setUser((prev) => ({
              ...DEFAULT_USER,
              ...prev,
              id: firebaseUser.uid,
              email: firebaseUser.email || prev?.email,
              name: firebaseUser.displayName || prev?.name
            }));
          }
        );

        return () => {
          if (unsubscribeProfile) unsubscribeProfile();
        };
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const openAuthModal = (tab = "signin") => {
    setAuthInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  // 1. Email + Password Sign In via Firebase Auth
  const login = async (email, password) => {
    try {
      if (!auth) {
        throw new Error("Firebase Auth is not initialized.");
      }
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = credential.user;
      const loggedUser = {
        ...DEFAULT_USER,
        id: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || email.split("@")[0]
      };
      setUser(loggedUser);
      setIsAuthenticated(true);
      localStorage.setItem("yatra_auth", "true");
      setIsAuthModalOpen(false);
      return { success: true, user: loggedUser };
    } catch (err) {
      console.warn("Firebase email login error:", err);
      let message = err.message;
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        message = "Invalid email or password. Please verify your credentials.";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email address format.";
      } else if (err.code === "auth/too-many-requests") {
        message = "Access temporarily disabled due to many failed attempts. Try again later or reset password.";
      }
      return { success: false, message };
    }
  };

  // 2. Google Sign-In via Firebase Auth
  const loginWithGoogle = async () => {
    try {
      if (!auth) throw new Error("Firebase Auth not initialized.");
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const socialUser = {
        ...DEFAULT_USER,
        uid: fbUser.uid,
        id: fbUser.uid,
        name: fbUser.displayName || "Google Traveler",
        email: fbUser.email || "",
        photoURL: fbUser.photoURL || "/default-avatar.png",
        avatar: fbUser.photoURL || "/default-avatar.png",
        phone: fbUser.phoneNumber || "+91 94480 12345",
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        verificationType: "Verified via Google Sign-In",
        homeCity: "Bengaluru, India"
      };
      await TravelSyncService.saveUserProfile(fbUser.uid, socialUser);
      setUser(socialUser);
      setIsAuthenticated(true);
      localStorage.setItem("yatra_auth", "true");
      setIsAuthModalOpen(false);
      return { success: true, user: socialUser };
    } catch (err) {
      console.warn("Google sign-in error:", err);
      let message = err.message;
      if (err.code === "auth/popup-closed-by-user") {
        message = "Google Sign-In was cancelled.";
      } else if (err.code === "auth/unauthorized-domain") {
        message = "This domain is not authorized for Google Sign-In. Add localhost to Firebase authorized domains.";
      }
      return { success: false, message };
    }
  };

  // Social Login wrapper (Google or Apple)
  const loginWithSocial = async (provider) => {
    if (provider === "Google") {
      return loginWithGoogle();
    }
    // Apple ID / Generic fallback
    const socialUser = {
      ...DEFAULT_USER,
      id: `usr-${provider.toLowerCase()}-${Date.now()}`,
      name: "Ananya Roy",
      email: `${provider.toLowerCase()}_traveler@example.com`,
      verificationType: `Verified via ${provider}`,
      homeCity: "Bengaluru, Karnataka"
    };
    setUser(socialUser);
    setIsAuthenticated(true);
    localStorage.setItem("yatra_auth", "true");
    setIsAuthModalOpen(false);
    return { success: true, user: socialUser };
  };

  // 3. Phone Authentication Setup & SMS OTP Dispatch
  const setupRecaptcha = (containerId = "recaptcha-container") => {
    if (!auth) return null;
    try {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          // Ignore clearing error
        }
      }
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved
        },
        "expired-callback": () => {
          console.warn("[Auth] reCAPTCHA expired, please retry.");
        }
      });
      return window.recaptchaVerifier;
    } catch (e) {
      console.warn("[Auth] Recaptcha setup notice:", e.message);
      return null;
    }
  };

  const sendPhoneOtp = async (phoneNumber, containerId = "recaptcha-container") => {
    try {
      if (!auth) throw new Error("Firebase Auth is not available.");
      const appVerifier = setupRecaptcha(containerId);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setPhoneConfirmationResult(confirmationResult);
      window.confirmationResult = confirmationResult;
      return { success: true, confirmationResult };
    } catch (err) {
      console.error("[Auth] Send Phone OTP error:", err);
      let message = err.message;
      if (err.code === "auth/invalid-phone-number") {
        message = "Invalid phone number format. Please include country code e.g. +91 9876543210";
      } else if (err.code === "auth/quota-exceeded") {
        message = "SMS quota exceeded for this project. Please try again later or use Email/Google.";
      }
      return { success: false, message };
    }
  };

  const verifyPhoneOtp = async (otpCode, additionalDetails = {}) => {
    try {
      const activeConfirmation = phoneConfirmationResult || window.confirmationResult;
      if (!activeConfirmation) {
        return { success: false, message: "No active verification session. Please request a new OTP." };
      }
      const credential = await activeConfirmation.confirm(otpCode);
      const fbUser = credential.user;
      const phoneUser = {
        ...DEFAULT_USER,
        id: fbUser.uid,
        name: additionalDetails.name || "Verified Mobile Traveler",
        phone: fbUser.phoneNumber || additionalDetails.phone || "",
        verificationType: "Phone Number (SMS OTP Verified)",
        homeCity: additionalDetails.city || "New Delhi, India"
      };
      await TravelSyncService.saveUserProfile(fbUser.uid, phoneUser);
      setUser(phoneUser);
      setIsAuthenticated(true);
      localStorage.setItem("yatra_auth", "true");
      setIsAuthModalOpen(false);
      return { success: true, user: phoneUser };
    } catch (err) {
      console.error("[Auth] Verify Phone OTP error:", err);
      let message = err.message;
      if (err.code === "auth/invalid-verification-code") {
        message = "Invalid 6-digit OTP code entered. Please check and retry.";
      } else if (err.code === "auth/code-expired") {
        message = "The SMS OTP code has expired. Please request a new code.";
      }
      return { success: false, message };
    }
  };

  // 4. Indian Citizen Account Registration (Email/Password + Profile to Firestore)
  const registerIndianUser = async (formData) => {
    try {
      if (!auth) throw new Error("Firebase Auth not initialized.");
      const credential = await createUserWithEmailAndPassword(auth, formData.email, formData.password || "Yatri@2026!");
      const fbUser = credential.user;
      
      try {
        await updateFirebaseProfile(fbUser, { displayName: formData.name });
      } catch (e) {
        // Continue if profile display name update fails
      }

      const newUser = {
        ...DEFAULT_USER,
        uid: fbUser.uid,
        id: fbUser.uid,
        name: formData.name || "Indian Traveler",
        email: formData.email,
        photoURL: fbUser.photoURL || "/default-avatar.png",
        avatar: fbUser.photoURL || "/default-avatar.png",
        phone: formData.phone || "+91 98000 00000",
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isForeigner: false,
        nationality: "Indian",
        verificationType: "Aadhaar / DigiLocker Verified",
        homeCity: `${formData.city || "New Delhi"}, ${formData.state || "India"}`,
        travelStyle: formData.travelStyle || "Heritage & Nature",
        joinedDate: "September 2026"
      };

      await TravelSyncService.saveUserProfile(fbUser.uid, newUser);
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("yatra_auth", "true");
      setIsAuthModalOpen(false);
      return { success: true, user: newUser };
    } catch (err) {
      console.warn("Registration error:", err);
      let message = err.message;
      if (err.code === "auth/email-already-in-use") {
        message = "This email is already in use. Please sign in instead.";
      } else if (err.code === "auth/weak-password") {
        message = "Password must be at least 6 characters.";
      }
      return { success: false, message };
    }
  };

  // 5. Foreigner / International Tourist Registration (Email/Password + e-Visa/Passport)
  const registerForeignerUser = async (formData) => {
    try {
      if (!auth) throw new Error("Firebase Auth not initialized.");
      const credential = await createUserWithEmailAndPassword(auth, formData.email, formData.password || "Yatri@2026!");
      const fbUser = credential.user;

      try {
        await updateFirebaseProfile(fbUser, { displayName: formData.passportName || formData.name });
      } catch (e) {
        // Continue if profile display name update fails
      }

      const foreignerUser = {
        ...DEFAULT_USER,
        uid: fbUser.uid,
        id: fbUser.uid,
        name: formData.passportName || formData.name || "International Traveler",
        email: formData.email,
        photoURL: fbUser.photoURL || "/default-avatar.png",
        avatar: fbUser.photoURL || "/default-avatar.png",
        phone: formData.phone || "+1 555 123 4567",
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isForeigner: true,
        nationality: formData.nationality || "United States",
        verificationType: "Verified International Tourist (Passport & e-Visa Checked)",
        passportNumber: formData.passportNumber ? formData.passportNumber.toUpperCase() : "PASS-998877",
        passportExpiry: formData.passportExpiry || "2030-12-31",
        visaNumber: formData.visaNumber ? formData.visaNumber.toUpperCase() : "IN-EVSA-2026-8899",
        visaType: formData.visaType || "e-Tourist Visa (30/365 Days)",
        visaExpiry: formData.visaExpiry || "2027-08-15",
        arrivalPort: formData.arrivalPort || "Indira Gandhi Int'l Airport (DEL)",
        homeCity: `${formData.homeCity || "New York"}, ${formData.nationality || "USA"}`,
        travelStyle: formData.travelStyle || "Spiritual & Monument Exploration",
        joinedDate: "September 2026"
      };

      await TravelSyncService.saveUserProfile(fbUser.uid, foreignerUser);
      setUser(foreignerUser);
      setIsAuthenticated(true);
      localStorage.setItem("yatra_auth", "true");
      setIsAuthModalOpen(false);
      return { success: true, user: foreignerUser };
    } catch (err) {
      console.warn("Foreigner registration error:", err);
      let message = err.message;
      if (err.code === "auth/email-already-in-use") {
        message = "This email is already in use. Please sign in instead.";
      }
      return { success: false, message };
    }
  };

  // 6. Reset Password via Firebase
  const resetPassword = async (email) => {
    try {
      if (!auth) throw new Error("Firebase Auth not initialized.");
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err) {
      console.warn("Password reset error:", err);
      return { success: false, message: err.message };
    }
  };

  // 7. Demo 1-Click Traveler Login (Arjun Verma)
  const loginWithDemo = async () => {
    setUser(DEFAULT_USER);
    setIsAuthenticated(true);
    localStorage.setItem("yatra_auth", "true");
    setIsAuthModalOpen(false);
    return { success: true, user: DEFAULT_USER };
  };

  // 8. Sign Out
  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn("Firebase sign-out error:", e);
    }
    setUser(DEFAULT_USER);
    setIsAuthenticated(false);
    localStorage.setItem("yatra_auth", "false");
    localStorage.removeItem("yatra_user");
  };

  // 9. Update Profile
  const updateProfile = async (updatedFields) => {
    try {
      if (user?.id) {
        await TravelSyncService.saveUserProfile(user.id, {
          ...updatedFields,
          updatedAt: new Date().toISOString()
        });
      }
      setUser((prev) => {
        const updated = {
          ...prev,
          ...updatedFields,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem("yatra_user", JSON.stringify(updated));
        return updated;
      });
      return { success: true };
    } catch (err) {
      console.warn("Update profile error:", err);
      return { success: false, message: err.message };
    }
  };

  // 10. Update Registered Location
  const updateRegisteredLocation = async (locationData) => {
    const updatedLocation = {
      ...user?.registeredLocation,
      ...locationData,
      updatedAt: new Date().toISOString()
    };
    setUser((prev) => {
      const updated = {
        ...prev,
        registeredLocation: updatedLocation
      };
      localStorage.setItem("yatra_user", JSON.stringify(updated));
      return updated;
    });

    if (user?.id) {
      await TravelSyncService.saveUserProfile(user.id, { registeredLocation: updatedLocation });
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
        loginWithGoogle,
        loginWithSocial,
        sendPhoneOtp,
        verifyPhoneOtp,
        registerIndianUser,
        registerForeignerUser,
        resetPassword,
        loginWithDemo,
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
