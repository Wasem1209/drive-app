import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Dashboard route
router.get("/", authMiddleware, (req: any, res: Response) => {
    const role = req.user.role;

    switch (role) {
        case "driver":
            return res.json({ message: "Driver dashboard data" });
        case "passenger":
            return res.json({ message: "Passenger dashboard data" });
        case "officer":
            return res.json({ message: "Officer dashboard data" });
        case "admin":
            return res.json({ message: "Admin dashboard data" });
        default:
            return res.status(400).json({ message: "Invalid role" });
    }
});

export default router;
