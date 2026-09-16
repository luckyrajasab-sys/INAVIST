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

describe("Trip Planner & Crisis Engine Suite", () => {
  it("POST /api/trips should create a new trip plan", async () => {
    const res = await request(app)
      .post("/api/trips")
      .send({
        title: "Goa Beachfront Getaway",
        startCity: "Mumbai",
        destinationName: "North & South Goa",
        days: 4,
        travellers: 2,
        totalEstimatedBudget: 24000,
        itinerary: [
          {
            day: 1,
            theme: "North Goa Beaches & Fort Aguada",
            activities: [{ title: "Visit Fort Aguada & Calangute Beach", cost: 200 }],
            stayCost: 2800
          }
        ]
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.shareToken).toBeDefined();
  });

  it("POST /api/trips/modify-crisis should dynamically re-route itinerary for weather hazards", async () => {
    const res = await request(app)
      .post("/api/trips/modify-crisis")
      .send({
        currentPlan: {
          title: "Monsoon Trek",
          totalEstimatedBudget: 18000,
          itinerary: [
            { day: 1, theme: "High Peak Trek", activities: [{ title: "Valley Ridge Trek", cost: 1500 }] }
          ]
        },
        crisisType: "heavy_rain"
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.actionTaken).toBeDefined();
    expect(res.body.data.safetyAdvice).toBeDefined();
  });
});
