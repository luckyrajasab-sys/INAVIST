import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import transportRoutes from "./routes/transportRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import govTourismRoutes from "./routes/govTourismRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Route Mounts
app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/transports", transportRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/gov-tourism", govTourismRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    platform: "YĀTRI — Every Journey, Made Smarter",
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal server error occurred" });
});

app.listen(PORT, () => {
  console.log(`[YĀTRI Backend Server] Running on http://localhost:${PORT}`);
});
