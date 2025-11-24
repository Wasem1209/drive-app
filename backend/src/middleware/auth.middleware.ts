import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request to include `user`
declare module "express-serve-static-core" {
    interface Request {
        user?: { id: string };
    }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    let token;

    // JWT is usually sent in Authorization header: "Bearer <token>"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET not set in .env");
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
                id: string;
            };

            req.user = { id: decoded.id };
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
