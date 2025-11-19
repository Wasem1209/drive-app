import { Router } from "express";
import { registerUser, loginUser, verifyEmail } from "../controllers/auth.controller";

const router = Router();

// Registration & login
router.post("/register", registerUser);
router.post("/login", loginUser);

// Email verification
router.get("/verify-email", verifyEmail);

export default router;
