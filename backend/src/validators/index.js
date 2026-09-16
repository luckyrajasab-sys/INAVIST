import Joi from "joi";

// Strong Password Pattern: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
const strongPasswordPattern = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?\":{}|<>_\\-\\/+=~`\\[\\]\\\\;']).{8,}$"
);

// Auth Validators
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(strongPasswordPattern)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.pattern.base":
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
    }),
  phone: Joi.string().allow("", null),
  isForeigner: Joi.boolean().default(false),
  nationality: Joi.string().default("Indian"),
  homeCity: Joi.string().allow("", null),
  travelStyle: Joi.string().allow("", null),
  passportNumber: Joi.string().allow("", null),
  visaNumber: Joi.string().allow("", null),
  visaType: Joi.string().allow("", null),
  arrivalPort: Joi.string().allow("", null),
  emergencyContact: Joi.string().allow("", null)
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const socialLoginSchema = Joi.object({
  provider: Joi.string().valid("google", "apple").required(),
  idToken: Joi.string().allow("", null),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  avatar: Joi.string().uri().allow("", null)
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(strongPasswordPattern)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.pattern.base":
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
    })
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  phone: Joi.string().allow("", null),
  homeCity: Joi.string().allow("", null),
  travelStyle: Joi.string().allow("", null),
  avatar: Joi.string().allow("", null),
  emergencyContacts: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      phone: Joi.string().required(),
      relation: Joi.string().default("Family")
    })
  ),
  travelPreferences: Joi.object({
    travelStyle: Joi.string().allow("", null),
    preferredTransport: Joi.string().allow("", null),
    budgetLevel: Joi.string().allow("", null),
    dietary: Joi.string().allow("", null)
  })
});

// Destination Validator
export const destinationSchema = Joi.object({
  id: Joi.string().allow("", null),
  name: Joi.string().required(),
  state: Joi.string().required(),
  district: Joi.string().required(),
  region: Joi.string().default("North"),
  category: Joi.string().default("nature"),
  isHiddenGem: Joi.boolean().default(false),
  rating: Joi.number().min(0).max(5).default(4.5),
  images: Joi.array().items(Joi.string()).default([]),
  description: Joi.string().required(),
  detailedDescription: Joi.string().allow("", null),
  coordinates: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required()
  }).required(),
  viewpointStatus: Joi.string().valid("OPEN", "CAUTION", "CLOSED").default("OPEN"),
  viewpointTimings: Joi.object({
    open: Joi.string().default("06:00 AM"),
    close: Joi.string().default("06:00 PM"),
    bestTime: Joi.string().allow("", null)
  }),
  estimatedCosts: Joi.object({
    travel: Joi.number().default(1000),
    stay: Joi.number().default(1500),
    food: Joi.number().default(500),
    entry: Joi.number().default(50),
    activities: Joi.number().default(200)
  }),
  entryFee: Joi.number().default(0),
  safetyRating: Joi.number().min(0).max(5).default(4.5),
  safetyTips: Joi.array().items(Joi.string()).default([]),
  emergencyInfo: Joi.object({
    policePhone: Joi.string().default("112"),
    medicalPhone: Joi.string().default("108"),
    nearestHospital: Joi.string().allow("", null),
    disasterHelp: Joi.string().default("1077")
  }),
  availableTransport: Joi.array().items(Joi.string()).default([]),
  nearbyAttractions: Joi.array().items(Joi.string()).default([]),
  hiddenPlacesNearby: Joi.array().items(Joi.string()).default([]),
  foodRecommendations: Joi.array().items(Joi.string()).default([]),
  localLanguages: Joi.array().items(Joi.string()).default([]),
  tags: Joi.array().items(Joi.string()).default([])
});

// Trip Validator
export const tripSchema = Joi.object({
  title: Joi.string().required(),
  startCity: Joi.string().default("New Delhi"),
  destinationId: Joi.string().allow("", null),
  destinationName: Joi.string().allow("", null),
  destinations: Joi.array().items(
    Joi.object({
      id: Joi.string(),
      name: Joi.string(),
      days: Joi.number().default(1)
    })
  ).default([]),
  startDate: Joi.string().allow("", null),
  endDate: Joi.string().allow("", null),
  travellers: Joi.number().min(1).default(1),
  days: Joi.number().min(1).default(3),
  totalEstimatedBudget: Joi.number().default(0),
  budgetPerPerson: Joi.number().default(0),
  itinerary: Joi.array().items(
    Joi.object({
      day: Joi.number().required(),
      theme: Joi.string().allow("", null),
      activities: Joi.array().items(
        Joi.object({
          time: Joi.string().allow("", null),
          title: Joi.string().required(),
          cost: Joi.number().default(0),
          location: Joi.string().allow("", null)
        })
      ).default([]),
      stayCost: Joi.number().default(0)
    })
  ).default([]),
  transportation: Joi.object().allow(null),
  accommodation: Joi.object().allow(null),
  notes: Joi.string().allow("", null),
  status: Joi.string().valid("planning", "active", "completed", "cancelled").default("active")
});

// Review Validator
export const reviewSchema = Joi.object({
  destinationId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  ratings: Joi.object({
    experience: Joi.number().min(1).max(5).default(5),
    cleanliness: Joi.number().min(1).max(5).default(5),
    safety: Joi.number().min(1).max(5).default(5),
    accessibility: Joi.number().min(1).max(5).default(5),
    valueForMoney: Joi.number().min(1).max(5).default(5)
  }),
  comment: Joi.string().min(10).max(2000).required(),
  travelTips: Joi.string().allow("", null),
  photos: Joi.array().items(Joi.string()).default([])
});

// SOS Validator
export const sosSchema = Joi.object({
  location: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    address: Joi.string().allow("", null)
  }).required(),
  message: Joi.string().default("EMERGENCY: Traveler triggered YĀTRI SOS! Immediate assistance needed.")
});

// Budget Validator
export const budgetCalculateSchema = Joi.object({
  budget: Joi.number().min(500).required(),
  travelers: Joi.number().min(1).default(1),
  durationDays: Joi.number().min(1).default(3),
  travelStyle: Joi.string().valid("budget", "moderate", "luxury", "backpacker").default("moderate"),
  startCity: Joi.string().allow("", null),
  destinationId: Joi.string().allow("", null)
});

// Travel Group Companion Validator
export const companionGroupSchema = Joi.object({
  title: Joi.string().min(5).max(150).required(),
  destination: Joi.string().required(),
  destinationId: Joi.string().allow("", null),
  travelDates: Joi.object({
    startDate: Joi.date().allow(null),
    endDate: Joi.date().allow(null),
    displayStr: Joi.string().required()
  }).required(),
  travelersNeeded: Joi.number().min(1).max(20).default(2),
  budgetPerPerson: Joi.number().min(0).default(5000),
  interests: Joi.array().items(Joi.string()).default([]),
  bio: Joi.string().max(1000).allow("", null),
  description: Joi.string().max(2000).allow("", null),
  requiredVerification: Joi.boolean().default(false)
});
