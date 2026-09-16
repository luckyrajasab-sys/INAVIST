import { Router } from "express";
import { validateUPI, createUPIIntent, verifyPayment } from "../controllers/paymentController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

router.post("/validate-upi", validateUPI);
router.post("/create-intent", optionalAuth, createUPIIntent);
router.post("/verify", optionalAuth, verifyPayment);

export default router;
