import { Request, Response } from "express";
import Vehicle from "../models/Vehicle";

export const registerVehicle = async (req: Request, res: Response) => {
    try {
        const { plateNumber, vin, model, color } = req.body;

        // Validate fields
        if (!plateNumber || !vin || !model || !color) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // Create vehicle record
        const newVehicle = await Vehicle.create({
            plateNumber,
            vin,
            vehicleModel: model, // map frontend "model" to DB field "vehicleModel"
            color,
            ownerId: "N/A", // optional placeholder since frontend doesn’t send it
        });

        return res.status(201).json({
            success: true,
            message: "Vehicle registered successfully!",
            vehicle: newVehicle,
        });
    } catch (err: any) {
        console.error("Vehicle registration error:", err);
        res.status(500).json({
            success: false,
            message: "Server error while registering vehicle",
            error: err.message,
        });
    }
};
