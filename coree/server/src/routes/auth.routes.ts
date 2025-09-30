import { Router } from "express";
import { loginHandler, registerHandler, meHandler, googleLoginHandler } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/google", googleLoginHandler);
router.get("/me", authMiddleware, meHandler);

export default router;
