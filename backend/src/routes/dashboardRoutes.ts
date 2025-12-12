import { Router, Request, Response } from "express";
import { protect } from "../middleware/auth.middleware";

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

const router = Router();

// Dashboard route
router.get("/", protect, (req: AuthRequest, res: Response) => {
    const role = req.user?.role;

    switch (role?.toLowerCase()) {
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
