// YĀTRI Production API Client & Real-Time Connection Layer

const API_BASE = import.meta.env?.VITE_API_URL || "/api";

export const getAuthToken = () => {
  return localStorage.getItem("yatri_jwt_token");
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("yatri_jwt_token", token);
  } else {
    localStorage.removeItem("yatri_jwt_token");
  }
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const request = async (endpoint, options = {}) => {
  const headers = options.isMultipart
    ? { ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}) }
    : { ...getAuthHeaders(), ...options.headers };

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();

    // Auto token refresh or auth error handle
    if (res.status === 401 && data.error === "TOKEN_EXPIRED") {
      const refreshToken = localStorage.getItem("yatri_refresh_token");
      if (refreshToken) {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: refreshToken })
        });
        const refreshData = await refreshRes.json();
        if (refreshData.success && refreshData.data?.token) {
          setAuthToken(refreshData.data.token);
          // Retry initial request with new token
          headers.Authorization = `Bearer ${refreshData.data.token}`;
          const retryRes = await fetch(`${API_BASE}${endpoint}`, { ...config, headers });
          return await retryRes.json();
        }
      }
    }

    return data;
  } catch (err) {
    console.warn(`[YĀTRI API Fetch Error] ${endpoint}:`, err);
    return {
      success: false,
      message: err.message || "Network request failed. Operating in offline/cached mode.",
      error: "NETWORK_ERROR"
    };
  }
};

export const api = {
  // Authentication System
  auth: {
    login: async (email, password) => {
      const res = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      if (res.success && res.data?.token) {
        setAuthToken(res.data.token);
        if (res.data.refreshToken) {
          localStorage.setItem("yatri_refresh_token", res.data.refreshToken);
        }
      }
      return res;
    },
    demoLogin: async () => {
      const res = await request("/auth/demo-login", { method: "POST" });
      if (res.success && res.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    },
    adminLogin: async () => {
      const res = await request("/auth/admin-login", { method: "POST" });
      if (res.success && res.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    },
    socialLogin: async (providerData) => {
      const res = await request("/auth/social", {
        method: "POST",
        body: JSON.stringify(providerData)
      });
      if (res.success && res.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    },
    register: async (userData) => {
      const res = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData)
      });
      if (res.success && res.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    },
    getMe: async () => {
      return await request("/auth/me");
    },
    forgotPassword: async (email) => {
      return await request("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });
    },
    resetPassword: async (token, newPassword) => {
      return await request("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword })
      });
    },
    logout: async () => {
      const refreshToken = localStorage.getItem("yatri_refresh_token");
      await request("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ token: refreshToken })
      });
      setAuthToken(null);
      localStorage.removeItem("yatri_refresh_token");
    }
  },

  // User Profile
  user: {
    getProfile: async () => request("/users/profile"),
    updateProfile: async (data) => request("/users/profile", { method: "PUT", body: JSON.stringify(data) }),
    uploadAvatar: async (formData) => request("/users/avatar", { method: "POST", body: formData, isMultipart: true }),
    changePassword: async (currentPassword, newPassword) =>
      request("/users/change-password", { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }) }),
    updateEmergencyContacts: async (emergencyContacts) =>
      request("/users/emergency-contacts", { method: "PUT", body: JSON.stringify({ emergencyContacts }) }),
    updatePreferences: async (travelPreferences) =>
      request("/users/preferences", { method: "PUT", body: JSON.stringify({ travelPreferences }) }),
    toggleFavorite: async (destId) => request(`/users/favorites/${destId}`, { method: "POST" }),
    getFavorites: async () => request("/users/favorites")
  },

  // Destinations & India Tourism Database
  destinations: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await request(`/destinations?${query}`);
    },
    getById: async (id) => request(`/destinations/${id}`),
    getByState: async (state) => request(`/destinations/state/${encodeURIComponent(state)}`),
    getByDistrict: async (district) => request(`/destinations/district/${encodeURIComponent(district)}`),
    search: async (q, limit = 20) => request(`/destinations/search?q=${encodeURIComponent(q)}&limit=${limit}`),
    getNearby: async (lat, lng, maxDistanceKm = 100) =>
      request(`/destinations/nearby?lat=${lat}&lng=${lng}&maxDistanceKm=${maxDistanceKm}`),
    create: async (destData) => request("/destinations", { method: "POST", body: JSON.stringify(destData) }),
    update: async (id, destData) => request(`/destinations/${id}`, { method: "PUT", body: JSON.stringify(destData) }),
    delete: async (id) => request(`/destinations/${id}`, { method: "DELETE" })
  },

  // Smart Budget Calculator & Destination Recommender
  budget: {
    calculate: async (budgetData) => request("/budget/calculate", { method: "POST", body: JSON.stringify(budgetData) }),
    recommend: async (params) => request("/budget/recommend", { method: "POST", body: JSON.stringify(params) })
  },

  // Multi-Modal Transport System
  transports: {
    search: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await request(`/transports?${query}`);
    },
    lookupPnr: async (pnr) => request(`/transports/pnr/${pnr}`)
  },

  // Hotels & Accommodations
  hotels: {
    search: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await request(`/hotels?${query}`);
    },
    getById: async (id) => request(`/hotels/${id}`)
  },

  // Travel Planner & Crisis Engine
  trips: {
    getAll: async () => request("/trips"),
    getById: async (id) => request(`/trips/${id}`),
    create: async (tripData) => request("/trips", { method: "POST", body: JSON.stringify(tripData) }),
    update: async (id, tripData) => request(`/trips/${id}`, { method: "PUT", body: JSON.stringify(tripData) }),
    delete: async (id) => request(`/trips/${id}`, { method: "DELETE" }),
    share: async (id) => request(`/trips/${id}/share`, { method: "POST" }),
    modifyCrisis: async (currentPlan, crisisType, customProblem) => {
      return await request("/trips/modify-crisis", {
        method: "POST",
        body: JSON.stringify({ currentPlan, crisisType, customProblem })
      });
    }
  },

  // Bookings
  bookings: {
    getAll: async () => request("/bookings"),
    create: async (bookingData) => request("/bookings", { method: "POST", body: JSON.stringify(bookingData) }),
    cancel: async (id) => request(`/bookings/${id}`, { method: "DELETE" })
  },

  // Emergency / SOS Real-Time Safety Network
  emergency: {
    triggerSOS: async (location, message) =>
      request("/emergency/sos", { method: "POST", body: JSON.stringify({ location, message }) }),
    getHistory: async () => request("/emergency/history"),
    resolveSOS: async (id, resolutionNotes) =>
      request(`/emergency/${id}/resolve`, { method: "PATCH", body: JSON.stringify({ resolutionNotes }) })
  },

  // Travel Companions & Safe Group Matching
  companions: {
    getGroups: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await request(`/companions?${query}`);
    },
    getGroupById: async (id) => request(`/companions/${id}`),
    createGroup: async (groupData) => request("/companions", { method: "POST", body: JSON.stringify(groupData) }),
    sendJoinRequest: async (id, message) => request(`/companions/${id}/join`, { method: "POST", body: JSON.stringify({ message }) }),
    respondToRequest: async (id, reqId, status) =>
      request(`/companions/${id}/requests/${reqId}`, { method: "POST", body: JSON.stringify({ status }) }),
    leaveGroup: async (id) => request(`/companions/${id}/leave`, { method: "POST" }),
    reportUser: async (targetUserId, reason, details) =>
      request("/companions/report", { method: "POST", body: JSON.stringify({ targetUserId, reason, details }) })
  },

  // Travel Passport / Visited Places
  history: {
    getAll: async () => request("/history"),
    saveRecord: async (record) => request("/history", { method: "POST", body: JSON.stringify(record) }),
    deleteRecord: async (id) => request(`/history/${id}`, { method: "DELETE" })
  },

  // Reviews & Ratings
  reviews: {
    getByDestination: async (destId) => request(`/reviews?destinationId=${destId}`),
    create: async (reviewData) => request("/reviews", { method: "POST", body: JSON.stringify(reviewData) }),
    delete: async (id) => request(`/reviews/${id}`, { method: "DELETE" }),
    report: async (id, reason, details) => request(`/reviews/${id}/report`, { method: "POST", body: JSON.stringify({ reason, details }) }),
    moderate: async (id, status) => request(`/reviews/${id}/moderate`, { method: "PUT", body: JSON.stringify({ status }) })
  },

  // Real-Time Travel Alerts & Warnings
  alerts: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await request(`/alerts?${query}`);
    },
    getByDestination: async (destId) => request(`/alerts/destination/${destId}`),
    create: async (alertData) => request("/alerts", { method: "POST", body: JSON.stringify(alertData) }),
    delete: async (id) => request(`/alerts/${id}`, { method: "DELETE" })
  },

  // Weather Microclimate Service
  weather: {
    get: async (location, lat = null, lng = null) => {
      const q = new URLSearchParams({ location: location || "", ...(lat ? { lat, lng } : {}) }).toString();
      return await request(`/weather?${q}`);
    }
  },

  // Notifications
  notifications: {
    getAll: async () => request("/notifications"),
    markAsRead: async (id) => request(`/notifications/${id}/read`, { method: "PATCH" }),
    markAllAsRead: async () => request("/notifications/read-all", { method: "PATCH" })
  },

  // Admin Dashboard
  admin: {
    getStats: async () => request("/admin/stats"),
    getUsers: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await request(`/admin/users?${query}`);
    },
    updateUserRole: async (id, role, isVerified) =>
      request(`/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role, isVerified }) }),
    getReports: async () => request("/admin/reports"),
    updateReportStatus: async (id, status) =>
      request(`/admin/reports/${id}`, { method: "PATCH", body: JSON.stringify({ status }) })
  },

  // Universal & Route Search
  search: {
    universal: async (q, limit = 10) => request(`/search?q=${encodeURIComponent(q)}&limit=${limit}`),
    routes: async (searchParams) =>
      request("/search/routes", { method: "POST", body: JSON.stringify(searchParams) }),
    locations: async (q) => request(`/search/locations?q=${encodeURIComponent(q)}`)
  },

  // Rewards & Loyalty
  rewards: {
    getSummary: async () => request("/rewards"),
    redeem: async (couponCode) =>
      request("/rewards/redeem", { method: "POST", body: JSON.stringify({ couponCode }) }),
    getHistory: async () => request("/rewards/history")
  },

  // UPI & Payments
  payments: {
    validateUPI: async (upiId) =>
      request("/payments/validate-upi", { method: "POST", body: JSON.stringify({ upiId }) }),
    createIntent: async (data) =>
      request("/payments/create-intent", { method: "POST", body: JSON.stringify(data) }),
    verifyPayment: async (data) =>
      request("/payments/verify", { method: "POST", body: JSON.stringify(data) })
  },

  // Tour Packages
  packages: {
    getAll: async () => request("/packages"),
    getById: async (id) => request(`/packages/${id}`),
    getByDestination: async (dest) => request(`/packages/destination/${encodeURIComponent(dest)}`)
  },

  // Government Tourism Hub
  govTourism: {
    getSchemes: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await request(`/gov-tourism?${query}`);
    }
  },

  // Health Check
  health: {
    check: async () => request("/health")
  }
};
