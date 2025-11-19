import { Request, Response, NextFunction } from "express";

export const validateProfile = (req: Request, res: Response, next: NextFunction) => {
    const { role, name, email, walletAddress } = req.body;

    if (!role || !name || !email) {
        return res.status(400).json({ message: "Role, name, and email are required" });
    }

    if (!["driver", "passenger", "officer", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    if (walletAddress && !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        return res.status(400).json({ message: "Invalid wallet address" });
    }

    // Role-specific validation
    if (role === "driver" && (!req.body.licenseNumber || !req.body.vehicleNumber)) {
        return res.status(400).json({ message: "Driver must provide licenseNumber and vehicleNumber" });
    }

    if ((role === "officer" || role === "admin") && !req.body.department) {
        return res.status(400).json({ message: "Officer/Admin must provide department" });
    }

    next();
};
