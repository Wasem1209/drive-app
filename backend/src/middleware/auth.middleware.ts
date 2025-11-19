import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
        return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
