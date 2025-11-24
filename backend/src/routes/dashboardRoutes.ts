import express from "express";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// Example protected route
router.get("/driver-dashboard", protect, (req, res) => {
    res.json({ message: `Welcome driver ${req.user?.id}` });
});

router.get("/passenger-dashboard", protect, (req, res) => {
    res.json({ message: `Welcome passenger ${req.user?.id}` });
});

export default router;
