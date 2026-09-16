import app from "../backend/src/app.js";
import { connectDB } from "../backend/src/config/db.js";
import { seedInitialData } from "../backend/src/scripts/seed.js";

let isDbInitialized = false;

export default async function handler(req, res) {
  if (!isDbInitialized) {
    try {
      await connectDB();
      if (process.env.MONGODB_URI) {
        await seedInitialData();
      }
      isDbInitialized = true;
    } catch (err) {
      console.warn("[Vercel Handler] Database connection attempt:", err.message);
    }
  }

  return app(req, res);
}
