// src/controllers/driver.controller.ts
import { Request, Response } from "express";
import Driver from "../models/DriverProfile";
import { ServiceDriver } from "../service/servicedriver";
export const getProfile = async (req: Request, res: Response) => {
    try {
        const driver = await Driver.findById(req.params.id);
        return res.json(driver);
    } catch (err) {
        return res.status(500).json({ message: "Failed to load profile" });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const driver = await Driver.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
        });
        return res.json(driver);
    } catch (err) {
        return res.status(500).json({ message: "Failed to update profile" });
    }
};

export const uploadDocs = async (req: Request, res: Response) => {
    try {
        // files come from multer
        return res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Upload failed" });
    }
};

export const getCompliance = async (req: Request, res: Response) => {
    const wallet = req.params.wallet;
    const data = await ServiceDriver.getCompliance(wallet);
    res.json(data);
};

export const payInsurance = async (req: Request, res: Response) => {
    const { wallet } = req.body;

    const unsignedTx = await ServiceDriver.createInsuranceTx(wallet);
    res.json({ unsignedTx });
};
