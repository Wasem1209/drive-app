import { Request, Response } from "express";
import Vehicle from "../models/Vehicle";

export const registerVehicle = async (req: Request, res: Response) => {
    try {
        const { plateNumber, vin, model, color } = req.body;

        if (!plateNumber || !vin || !model || !color) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // 👉 MOCK OWNER ID + WALLET ADDRESS so MongoDB will not fail
        const ownerId = "TEMP_DRIVER_ID";
        const walletAddress = "MOCK_WALLET_" + Math.random().toString(36).substring(2, 12);

        const newVehicle = await Vehicle.create({
            plateNumber,
            vin,
            vehicleModel: model,
            color,
            ownerId,
            walletAddress
        });

        return res.status(201).json({
            success: true,
            message: "Vehicle registered successfully!",
            vehicle: newVehicle
        });

    } catch (err: any) {
        console.error("Vehicle registration error:", err);
        res.status(500).json({
            success: false,
            message: "Server error while registering vehicle",
            error: err.message
        });
    }
};
