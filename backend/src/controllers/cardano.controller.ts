// controllers/cardano.controller.ts
import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import crypto from "crypto";
import Driver from "../models/Driver";
import Vehicle from "../models/Vehicle";

// Environment variables (just keep policy ID for reference)
const POLICY_ID = process.env.POLICY_ID!;

/**
 * Generate unique token name
 */
const generateTokenName = () => "ID_" + crypto.randomBytes(6).toString("hex");

/**
 * Fake mint Driver Identity NFT (for hackathon/testing)
 */
export const mintDriverIdentity = async (req: Request, res: Response) => {
    try {
        const { driverId } = req.body;
        const driver = await Driver.findById(driverId);
        if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

        const tokenName = generateTokenName();
        const tokenHex = Buffer.from(tokenName).toString("hex");

        // Fake txHash (just a random string for testing)
        const fakeTxHash = crypto.randomBytes(16).toString("hex");

        driver.cardanoIdentity = {
            tokenName,
            tokenId: `${POLICY_ID}.${tokenHex}`,
            txHash: fakeTxHash,
        };
        await driver.save();

        return res.status(201).json({
            success: true,
            message: "Driver identity minted successfully (fake)",
            tokenName,
            tokenId: driver.cardanoIdentity.tokenId,
            txHash: driver.cardanoIdentity.txHash,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Minting failed", error: error.message });
    }
};

/**
 * Fake mint Vehicle Identity NFT
 */
export const mintVehicleIdentity = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.body;
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

        const tokenName = generateTokenName();
        const tokenHex = Buffer.from(tokenName).toString("hex");

        const fakeTxHash = crypto.randomBytes(16).toString("hex");

        vehicle.cardanoIdentity = {
            tokenName,
            tokenId: `${POLICY_ID}.${tokenHex}`,
            txHash: fakeTxHash,
        };
        await vehicle.save();

        return res.status(201).json({
            success: true,
            message: "Vehicle identity minted successfully (fake)",
            tokenName,
            tokenId: vehicle.cardanoIdentity.tokenId,
            txHash: vehicle.cardanoIdentity.txHash,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Minting failed", error: error.message });
    }
};
