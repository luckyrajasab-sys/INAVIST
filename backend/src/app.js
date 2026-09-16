import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";

import { swaggerDocument } from "./config/swagger.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import transportRoutes from "./routes/transportRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import sosRoutes from "./routes/sosRoutes.js";
import companionRoutes from "./routes/companionRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import govTourismRoutes from "./routes/govTourismRoutes.js";

const app = express();

// Security & Core Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = [
      process.env.CLIENT_URL,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ].filter(Boolean);
    if (allowed.includes(origin) || process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

// Static Uploads Folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Global API Rate Limiter
app.use("/api", apiLimiter);

// Interactive Swagger / OpenAPI Documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Production Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    platform: "INAVIST — India • Travel • Tourism",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// REST API Route Mounts
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/transports", transportRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/emergency", sosRoutes);
app.use("/api/companions", companionRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/gov-tourism", govTourismRoutes);

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
