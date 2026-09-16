# YĀTRI — Production-Ready Travel & Tourism Backend

Production-ready, highly scalable, and secure backend for the India-focused **YĀTRI** Travel & Tourism Application built with **Node.js, Express.js, MongoDB/Mongoose, Socket.IO, JWT, and Swagger/OpenAPI**.

---

## 🌟 Key Features

1. **JWT Authentication & Multi-Role Authorization**
   - Email/password registration, login, token refresh rotation, demo login, admin login, and social login (Google/Apple).
   - Multi-role access control (`user`, `admin`, `moderator`).
   - Secure bcrypt password hashing and token expiration.

2. **165+ Curated Indian Tourism Destinations**
   - Seeded database covering all 28 Indian States & Union Territories.
   - Rich metadata: Entry fees, coordinates (2dsphere geospatial index), timings, viewpoints, crowd levels, safety tips, emergency info, food recommendations, and budget estimates.
   - Text search, state/district filtering, category filtering, and nearby geospatial radius search.

3. **Smart Budget Calculator & Destination Recommender**
   - Expense breakdown calculation (stay, food, travel, activities, entry fees, local commute, 10% emergency buffer, 5% miscellaneous).
   - Dynamic destination matcher for any total budget, duration, and traveler count.

4. **Crisis Re-routing Engine (Modify My Trip)**
   - Smart situational planner that rescues itineraries impacted by bad weather, landslides, roadblocks, or budget deficits.

5. **Multi-Modal Transport & PNR Engine**
   - Extensible provider abstraction for Flights, Trains (Vande Bharat, Rajdhani), Buses (Volvo Multi-Axle), and Cabs/Taxis.
   - Live PNR status lookup.

6. **Real-Time Safety & SOS Emergency Network**
   - Emergency SOS trigger (`POST /api/emergency/sos`) recording GPS coordinates and dispatching alerts to emergency contacts and admin room via Socket.IO.

7. **Travel With Stranger / Travel Companions Matching**
   - Create travel groups, browse open groups, send join requests, approve/reject members, and chat in real-time.
   - User report and safety block architecture.

8. **Live Travel Alerts & Road Warnings**
   - Real-time weather warnings, landslides, and road closures broadcasted over Socket.IO rooms (`dest:<id>` and global).

9. **Interactive Swagger API Documentation**
   - Live interactive Swagger UI at `http://localhost:5000/api/docs`.

10. **Testing & In-Memory MongoDB Zero-Setup Execution**
    - Runs seamlessly out-of-the-box using either MongoDB Atlas / local MongoDB or automatic In-Memory database.

---

## 📁 Backend Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                 # Mongoose connection & in-memory fallback
│   │   └── swagger.js            # Swagger / OpenAPI documentation config
│   ├── controllers/
│   │   ├── adminController.js     # Admin dashboard stats & moderation
│   │   ├── alertController.js     # Travel alerts & road notices
│   │   ├── authController.js      # Auth, JWT, reset password
│   │   ├── bookingController.js   # Transport & hotel bookings
│   │   ├── budgetController.js    # Budget calculation & recommendations
│   │   ├── companionController.js # Travel with stranger & group matching
│   │   ├── destinationController.js # 165+ destinations CRUD & search
│   │   ├── govTourismController.js # Government tourism schemes
│   │   ├── historyController.js   # Travel passport & visited places
│   │   ├── hotelController.js     # Stays, homestays, resorts search
│   │   ├── notificationController.js # User notifications
│   │   ├── reviewController.js    # Ratings & reviews
│   │   ├── searchController.js    # Universal global search
│   │   ├── sosController.js       # Emergency SOS triggers & broadcast
│   │   ├── transportController.js # Multi-modal transport & PNR
│   │   ├── tripController.js      # Trip planner & crisis engine
│   │   ├── userController.js      # User profile, emergency contacts
│   │   └── weatherController.js   # Microclimate weather & caching
│   ├── middleware/
│   │   ├── auth.js                # JWT token verification
│   │   ├── errorHandler.js        # Centralized error handler
│   │   ├── rateLimiter.js         # Express rate limiters
│   │   ├── role.js                # Role authorization
│   │   └── upload.js              # Multer file upload filter
│   ├── models/                    # Mongoose Schemas (User, Destination, Trip, etc.)
│   ├── routes/                    # Express REST route mounts
│   ├── services/                  # Business logic & external provider abstractions
│   ├── sockets/                   # Socket.IO real-time event handlers
│   ├── utils/                     # ApiResponse, JWT, Logger helpers
│   ├── validators/                # Joi request validation schemas
│   ├── scripts/
│   │   └── seed.js                # Database seeder with 165+ Indian destinations
│   ├── tests/                     # Jest & Supertest test suite
│   ├── app.js                     # Express app setup
│   └── server.js                  # HTTP & Socket.IO server listener
├── uploads/                       # Local uploaded images directory
├── .env                           # Environment configuration
├── .env.example                   # Environment template
└── package.json                   # Dependencies and scripts
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 4. Seed the Database (165+ Indian Destinations)
```bash
npm run seed
```

### 5. Start the Server
```bash
# Development mode with hot-reload
npm run dev

# Production mode
npm start
```

Backend will be active at **`http://localhost:5000`**
Swagger API Docs will be available at **`http://localhost:5000/api/docs`**

---

## 🧪 Running Automated Tests

Run the complete Jest & Supertest test suite:
```bash
cd backend
npm test
```

---

## 📡 REST API Reference Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Health Check | No |
| **POST** | `/api/auth/register` | Register new user | No |
| **POST** | `/api/auth/login` | Login with email/password | No |
| **POST** | `/api/auth/demo-login` | Instant Demo user login | No |
| **POST** | `/api/auth/admin-login` | Instant Admin user login | No |
| **GET** | `/api/auth/me` | Get authenticated user profile | Bearer Token |
| **GET** | `/api/destinations` | List destinations (filters, pagination) | No |
| **GET** | `/api/destinations/search` | Search destinations | No |
| **GET** | `/api/destinations/nearby` | 2dsphere Geospatial nearby search | No |
| **GET** | `/api/destinations/:id` | Get destination details | No |
| **POST** | `/api/budget/calculate` | Calculate detailed trip expense breakdown | No |
| **POST** | `/api/budget/recommend` | Destination recommendations matching budget | No |
| **GET** | `/api/transports` | Search Flights, Trains, Buses, Cabs | No |
| **GET** | `/api/transports/pnr/:pnr`| Live PNR lookup | No |
| **GET** | `/api/hotels` | Search Stays & Homestays | No |
| **GET** | `/api/trips` | Get saved trips | Optional |
| **POST** | `/api/trips` | Save custom trip plan | Optional |
| **POST** | `/api/trips/modify-crisis`| Crisis Re-routing Engine | No |
| **POST** | `/api/emergency/sos` | Trigger Emergency SOS Broadcast | Optional |
| **GET** | `/api/emergency/history` | Emergency SOS history | Bearer Token |
| **GET** | `/api/companions` | Discover Travel Groups | No |
| **POST** | `/api/companions` | Create Travel Group | Bearer Token |
| **POST** | `/api/companions/:id/join`| Send join request | Bearer Token |
| **GET** | `/api/alerts` | Active Travel Alerts & Road Notices | No |
| **GET** | `/api/weather` | Microclimate Weather & Forecast | No |
| **GET** | `/api/admin/stats` | Admin Dashboard Metrics | Admin Role |
| **GET** | `/api/search` | Universal Global Search | No |

---

## ⚡ Socket.IO Real-Time Events

- `user:subscribe` (`userId`): Subscribes client to personal notifications and join request updates.
- `destination:subscribe` (`destId`): Subscribes to live weather and road hazards for a destination.
- `alert:new` / `alert:global`: Broadcasted when new hazard notices are published.
- `emergency:sos`: Instant SOS broadcast to admin and emergency monitoring dispatchers.
- `group:join_room` / `group:send_message`: Real-time group chat for travel companion squads.

---

## 🚢 Production Deployment

### Deploying to Render / Railway / AWS
1. Set the root directory or working directory to `backend/`.
2. Set Build Command: `npm install`
3. Set Start Command: `node src/server.js`
4. Set Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/yatri_db`
   - `JWT_SECRET=<your-super-secret-key>`
   - `CLIENT_URL=https://your-yatri-frontend.com`
