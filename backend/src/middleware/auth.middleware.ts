import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");

            const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };

            // Fetch user role from DB
            const user = await User.findById(decoded.id);
            if (!user) return res.status(401).json({ message: "User not found" });

            req.user = { id: user._id.toString(), role: user.role };
            next();
        } catch (err) {
            console.error(err);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};
