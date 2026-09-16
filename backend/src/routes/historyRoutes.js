import { Router } from "express";
import {
  getHistory,
  addOrUpdateHistory,
  deleteHistory
} from "../controllers/historyController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", getHistory);
router.post("/", addOrUpdateHistory);
router.delete("/:id", deleteHistory);

export default router;
