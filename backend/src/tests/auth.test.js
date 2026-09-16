import request from "supertest";
import app from "../app.js";
import { connectDB, disconnectDB } from "../config/db.js";
import { User } from "../models/User.js";

beforeAll(async () => {
  process.env.USE_MEMORY_DB = "true";
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Authentication & User API Suite", () => {
  const testUser = {
    name: "Test Traveler",
    email: `traveler_${Date.now()}@example.com`,
    password: "Password123!",
    phone: "+91 9876543210"
  };

  it("POST /api/health should return healthy status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe("healthy");
  });

  it("POST /api/auth/register should create a new user and return JWT tokens", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
  });

  it("POST /api/auth/login should authenticate valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it("POST /api/auth/login should reject invalid passwords", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "WrongPassword"
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/auth/me should return authenticated user profile", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });

    const token = loginRes.body.data.token;

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
  });
});
