// src/controllers/driver.controller.ts
import { Request, Response } from "express";
import Driver from "../models/DriverProfile.model";
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
    try {
        const walletPkh = req.params.wallet;
        const data = await ServiceDriver.getCompliance(walletPkh);
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ message: "Failed to get compliance", error: err.message });
    }
};

export const payInsurance = async (req: Request, res: Response) => {
    try {
        const { walletPkh, insuranceExpiryMs } = req.body;

        // Default to 1 year from now if not provided
        const expiryMs = insuranceExpiryMs || (Date.now() + 365 * 24 * 60 * 60 * 1000);

        const result = await ServiceDriver.createInsuranceTx(walletPkh, expiryMs);

        if (!result) {
            return res.status(404).json({ message: "Vehicle not found on-chain" });
        }

        res.json({ unsignedTx: result.unsignedTx });
    } catch (err: any) {
        res.status(500).json({ message: "Failed to create insurance tx", error: err.message });
    }
};

export const payRoadTax = async (req: Request, res: Response) => {
    try {
        const { walletPkh, taxExpiryMs } = req.body;

        // Default to 1 year from now if not provided
        const expiryMs = taxExpiryMs || (Date.now() + 365 * 24 * 60 * 60 * 1000);

        const result = await ServiceDriver.createRoadTaxTx(walletPkh, expiryMs);

        if (!result) {
            return res.status(404).json({ message: "Vehicle not found on-chain" });
        }

        res.json({ unsignedTx: result.unsignedTx });
    } catch (err: any) {
        res.status(500).json({ message: "Failed to create road tax tx", error: err.message });
    }
};
