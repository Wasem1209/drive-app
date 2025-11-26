// backend/src/routes/dashboardRoutes.ts
import { Router, Response } from "express";
import { protect } from "../middleware/auth.middleware";
import { Request } from "express";

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

const router = Router();

// GET /api/dashboard
router.get("/", protect, (req: AuthRequest, res: Response) => {
    const role = req.user?.role?.toLowerCase();

    switch (role) {
        case "driver":
            return res.json({ message: `Welcome driver ${req.user?.id}` });
        case "passenger":
            return res.json({ message: `Welcome passenger ${req.user?.id}` });
        case "officer":
            return res.json({ message: `Welcome officer ${req.user?.id}` });
        case "admin":
            return res.json({ message: `Welcome admin ${req.user?.id}` });
        default:
            return res.status(400).json({ message: "Invalid role" });
    }
});

export default router;
