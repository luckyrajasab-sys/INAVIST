import { Router } from "express";
import { searchTransport, lookupPNR } from "../controllers/transportController.js";

const router = Router();

router.get("/", searchTransport);
router.get("/pnr/:pnr", lookupPNR);

export default router;
