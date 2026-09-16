# INAVIST — Incredible India Travel & Tourism Platform

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react)](frontend)
[![Express](https://img.shields.io/badge/Backend-Express.js%20%2B%20Node-000000?logo=express)](backend)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2F%20Mongoose-47A248?logo=mongodb)](backend)

**INAVIST** (YĀTRI) is a modern, production-grade travel platform tailored for India's diverse landscapes, sacred heritage temples, high-altitude passes, and coastal getaways.

---

## 🚀 Key Features

- **174+ Indian Destinations & Hidden Gems**: Curated directory covering all 28 Indian States & Union Territories with ratings, viewpoints, crowd indicators, and seasonal timings.
- **Smart End-to-End Transport Hub**: Multi-modal journey options combining Vande Bharat / Superfast Trains, Domestic Flights, Volvo Buses, and Outstation Cabs.
- **Instant UPI Payments**: Integrated UPI QR code generation, handle validation, and real-time transaction confirmation.
- **YĀTRI Travel Passport & Rewards**: Gamified badges, visited district counters, and redeemable points for discounts on hotels and bookings.
- **Safety & Emergency SOS Network**: Slide-to-dispatch SOS alerting with simulated high-precision GPS coordinates and emergency contacts synchronization.
- **Crisis Re-Routing Engine**: Instant itinerary adjustments for bad weather, roadblocks, and sudden travel constraints.
- **Government Tourism Hub**: Direct portal into central and state tourism promotion schemes.

---

## 🛠️ Architecture & Monorepo Structure

```
INAVIST/
├── api/                  # Vercel Serverless Function entrypoint (api/index.js)
├── backend/              # Node.js + Express.js REST API
│   ├── src/
│   │   ├── config/       # MongoDB connection & Swagger configuration
│   │   ├── controllers/  # Auth, destination, booking, transport, reward handlers
│   │   ├── middleware/   # JWT auth, role validation, rate limiting, error handler
│   │   ├── models/       # Mongoose schemas (User, Destination, Booking, etc.)
│   │   ├── routes/       # Express route definitions
│   │   └── scripts/      # Database seeding scripts (174 destinations)
│   └── package.json
├── frontend/             # React 18 + Vite SPA
│   ├── src/
│   │   ├── api/          # Unified API Client with JWT refresh handling
│   │   ├── components/   # UI components (Explorer, TransportHub, Planner, etc.)
│   │   ├── context/      # AuthContext, PlannerContext, RewardsContext, ThemeContext
│   │   └── services/     # Route calculation & payment services
│   └── package.json
├── vercel.json           # Unified Vercel full-stack deployment configuration
└── package.json          # Root workspace scripts (concurrently dev & build)
```

---

## 💻 Local Development

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
Install all dependencies for both frontend and backend from the root:
```bash
npm install --prefix backend
npm install --prefix frontend
```

### 3. Run Development Server
Start both Express backend (port `5000`) and Vite frontend (port `3000`) concurrently:
```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Interactive Swagger API Docs**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

### 4. Database Seeding
To populate MongoDB with the complete 174 destinations, user profiles, hotels, and transport routes:
```bash
npm run seed
```

---

## ☁️ Deployment on Vercel

This repository is pre-configured with `vercel.json` for one-click deployment:

1. Import your repository into **[Vercel](https://vercel.com)**: `luckyrajasab-sys/INAVIST`.
2. Keep the **Root Directory** as `./`.
3. Add the following **Environment Variables** in your Vercel Project Settings:
   - `MONGODB_URI`: Your MongoDB Atlas URI (`mongodb+srv://<username>:<password>@cluster.mongodb.net/yatri_db`)
   - `JWT_SECRET`: Your secure JWT secret key
   - `JWT_REFRESH_SECRET`: Your secure refresh token secret key
   - `NODE_ENV`: `production`
4. Click **Deploy**. Vercel will build the Vite frontend and host the Express API serverlessly via `/api`.

---

## 🔒 Security & Best Practices
- Helmet HTTP security headers enabled
- CORS configured for secure local and production origins
- JWT access tokens with 7-day expiration and automatic refresh token rotation
- Bcrypt password hashing
- Rate limiting protection on sensitive auth endpoints

---

## 📄 License
MIT © YĀTRI Development Team
