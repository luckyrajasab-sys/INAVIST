import request from "supertest";
import app from "../app.js";
import { connectDB, disconnectDB } from "../config/db.js";
import { Destination } from "../models/Destination.js";

beforeAll(async () => {
  process.env.USE_MEMORY_DB = "true";
  await connectDB();
  await Destination.create([
    {
      id: "ladakh-pangong-test",
      name: "Pangong Tso Lake",
      state: "Ladakh",
      district: "Leh",
      category: "nature",
      rating: 4.9,
      description: "High-altitude Himalayan lake.",
      coordinates: { lat: 33.7595, lng: 78.6674 }
    },
    {
      id: "ka-hampi-test",
      name: "Hampi Ruins",
      state: "Karnataka",
      district: "Vijayanagara",
      category: "historical",
      rating: 4.8,
      description: "Ancient Vijayanagara kingdom capital.",
      coordinates: { lat: 15.3350, lng: 76.4600 }
    }
  ]);
});

afterAll(async () => {
  await disconnectDB();
});

describe("Destination APIs Suite", () => {
  it("GET /api/destinations should list destinations with pagination", async () => {
    const res = await request(app).get("/api/destinations?limit=10");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it("GET /api/destinations/search should search across name and state", async () => {
    const res = await request(app).get("/api/destinations/search?q=Hampi");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].name).toContain("Hampi");
  });

  it("GET /api/destinations/:id should return destination details", async () => {
    const res = await request(app).get("/api/destinations/ladakh-pangong-test");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe("ladakh-pangong-test");
  });
});
