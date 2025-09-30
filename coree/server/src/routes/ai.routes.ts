import { Router } from "express";
import { aiReplyHandler } from "../controllers/ai.controller.js";

const router = Router();

router.post("/reply", aiReplyHandler);

export default router; 