import { Router } from "express";
import { getGovSchemes } from "../controllers/govTourismController.js";

const router = Router();

router.get("/", getGovSchemes);

export default router;
