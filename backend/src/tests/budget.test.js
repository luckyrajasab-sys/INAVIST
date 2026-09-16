import request from "supertest";
import app from "../app.js";
import { connectDB, disconnectDB } from "../config/db.js";

beforeAll(async () => {
  process.env.USE_MEMORY_DB = "true";
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Smart Budget Calculator Suite", () => {
  it("POST /api/budget/calculate should compute accurate expense breakdown and reserve", async () => {
    const res = await request(app)
      .post("/api/budget/calculate")
      .send({
        budget: 15000,
        travelers: 2,
        durationDays: 4,
        travelStyle: "moderate"
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.breakdown).toBeDefined();
    expect(res.body.data.breakdown.transportation).toBeGreaterThan(0);
    expect(res.body.data.breakdown.emergencyReserve).toBeGreaterThan(0);
    expect(res.body.data.perPersonCost).toBeDefined();
  });

  it("POST /api/budget/recommend should recommend destinations fitting budget", async () => {
    const res = await request(app)
      .post("/api/budget/recommend")
      .send({
        budget: 25000,
        travelers: 2,
        durationDays: 3
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.recommendations)).toBe(true);
  });
});
