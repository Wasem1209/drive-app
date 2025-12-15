import { Request, Response } from "express";
import Driver from "../models/Driver";

export const registerDriver = async (req: Request, res: Response) => {
    try {
        const {
            nin,
            fullName,
            dob,
            gender,
            phone,
            city,
            currentHomeAddress,
            permanentHomeAddress,
            occupation,
        } = req.body;

        // Validate required fields
        if (!nin || !fullName || !dob || !gender) {
            return res.status(400).json({
                success: false,
                message: "NIN, fullName, DOB and gender are required",
            });
        }

        // Create driver
        const driver = await Driver.create({
            nin,
            fullName,
            dob,
            gender,
            phone,
            city,
            currentHomeAddress,
            permanentHomeAddress,
            occupation,
        });

        return res.status(201).json({
            success: true,
            driverId: driver._id,
            message: "Driver registered successfully",
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Driver register failed",
            error: error.message,
        });
    }
};