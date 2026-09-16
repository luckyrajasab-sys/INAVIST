import { Router } from "express";
import { getPackages, getPackageById, getPackagesByDestination } from "../controllers/packageController.js";

const router = Router();

router.get("/", getPackages);
router.get("/destination/:dest", getPackagesByDestination);
router.get("/:id", getPackageById);

export default router;
