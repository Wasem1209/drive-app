import { Request, Response } from "express";
import Driver from "../models/Driver";

export const registerDriver = async (req: Request, res: Response) => {
    try {
        const driver = await Driver.create(req.body);

        return res.json({
            success: true,
            driverId: driver._id,
            vehicleId: driver.vehicleId,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Driver register failed" });
    }
};
