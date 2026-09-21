# INAVIST — Incredible India Travel & Tourism Platform

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react)](frontend)
[![Status](https://img.shields.io/badge/Architecture-Frontend%20Only%20SPA-10B981)](#)

**INAVIST** is a modern, high-performance web platform tailored for India's diverse landscapes, sacred heritage temples, high-altitude passes, and coastal getaways. Built with React 18 and Vite, it is 100% self-contained and optimized for instant, zero-configuration deployment on **Vercel**.

---

## 🚀 Key Features

- **174+ Indian Destinations & Hidden Gems**: Curated directory covering all 28 Indian States & Union Territories with ratings, viewpoints, crowd indicators, and seasonal timings.
- **Smart End-to-End Transport Hub**: Multi-modal journey options combining Vande Bharat / Superfast Trains, Domestic Flights, Volvo Buses, and Outstation Cabs.
- **Instant UPI Payments**: Integrated UPI QR code generation, handle validation, and real-time transaction confirmation.
- **YĀTRI Travel Passport & Rewards**: Gamified badges, visited district counters, and redeemable points for discounts on hotels and bookings.
- **Safety & Emergency SOS Network**: Slide-to-dispatch SOS alerting with simulated high-precision GPS coordinates and emergency contacts synchronization.
- **Crisis Re-Routing Engine**: Instant itinerary adjustments for bad weather, roadblocks, and sudden travel constraints.
- **Government Tourism Hub**: Direct portal into central and state tourism promotion schemes.
- **Persistent Client-Side State**: Bookings, profiles, trips, favorites, and saved UPI accounts persist across sessions via `localStorage`.

---

## 🛠️ Project Structure

```
INAVIST/
├── frontend/             # React 18 + Vite Web Application
│   ├── src/
│   │   ├── api/          # Standalone client & state persistence engine
│   │   ├── components/   # UI components (Explorer, TransportHub, Planner, SOS, etc.)
│   │   ├── context/      # AuthContext, PlannerContext, RewardsContext, ThemeContext
│   │   ├── data/         # Curated 174+ destinations, hotels, and packages dataset
│   │   └── services/     # Route calculation & UPI payment services
│   ├── vercel.json       # Vercel SPA routing rules for frontend root
│   └── package.json
├── vercel.json           # Root Vercel deployment configuration
└── package.json          # Root workspace scripts
```

---

## 💻 Local Development

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
Install dependencies from the root:
```bash
npm install --prefix frontend
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
```

---

## ☁️ 1-Click Deployment on Vercel

This repository is pre-configured for instant zero-config Vercel deployment:

1. Push your changes to GitHub.
2. Go to **[Vercel](https://vercel.com)** and click **"Add New Project"**.
3. Select your repository: `luckyrajasab-sys/INAVIST`.
4. Deploy with defaults:
   - **Root Directory**: `./` (or `frontend`)
   - **Build Command**: `npm run build --prefix frontend` (auto-detected via `vercel.json`)
   - **Output Directory**: `frontend/dist` (auto-detected via `vercel.json`)
5. Click **Deploy**! Your site is live on Vercel Edge with zero server dependencies or database setup needed.
