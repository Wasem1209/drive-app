// src/routes/profile.route.ts
import express from "express";
import { setupProfile } from "../controllers/profile.controller";
import { protect } from "../middleware/authMiddleware";
import { validateProfile } from "../middleware/validateProfile.middleware";

const router = express.Router();

// POST /api/profile/setup
// Protected route for all roles (driver, passenger, officer, admin)
router.post("/setup", protect, validateProfile, setupProfile);

export default router;
