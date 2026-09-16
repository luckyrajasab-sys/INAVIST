import { Router } from "express";
import { calculateBudget, recommendByBudget } from "../controllers/budgetController.js";

const router = Router();

router.post("/calculate", calculateBudget);
router.post("/recommend", recommendByBudget);

export default router;
