// controllers/cardano.controller.ts

import { Request, Response } from "express";
import { BlockFrostAPI } from "@blockfrost/blockfrost-js";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";
import Driver from "../models/Driver";
import Vehicle from "../models/Vehicle";

const blockfrost = new BlockFrostAPI({
    projectId: 'YOUR_BLOCKFROST_PROJECT_ID' // replace with your actual key
});

const POLICY_ID = process.env.POLICY_ID!;
const POLICY_SCRIPT = process.env.POLICY_SCRIPT_PATH!;
const SKEY_PATH = process.env.POLICY_KEY_PATH!;
const NETWORK = process.env.NETWORK === "mainnet" ? "--mainnet" : "--testnet-magic 2";

/**
 * Helper to run cardano-cli commands
 */
const cli = (cmd: string) => execSync(cmd, { encoding: "utf-8" });

/**
 * Generate unique token name
 */
const generateTokenName = () =>
    "ID_" + crypto.randomBytes(6).toString("hex");

/**
 * MINT DRIVER IDENTITY
 */
export const mintDriverIdentity = async (req: Request, res: Response) => {
    try {
        const { driverId } = req.body;

        const driver = await Driver.findById(driverId);
        if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

        const tokenName = generateTokenName();
        const tokenHex = Buffer.from(tokenName).toString("hex");

        const metadata = {
            "721": {
                [POLICY_ID]: {
                    [tokenName]: {
                        fullName: driver.fullName,
                        email: driver.email,
                        phone: driver.phone,
                        nin: driver.nin,
                        dob: driver.dob,
                        gender: driver.gender,
                        issued: new Date().toISOString(),
                        type: "DRIVER_IDENTITY",
                    },
                },
            },
        };

        const metadataPath = path.join("tmp", `meta-${tokenName}.json`);
        fs.writeFileSync(metadataPath, JSON.stringify(metadata));

        const txFile = `tmp/tx-${tokenName}.raw`;
        const signedTxFile = `tmp/tx-${tokenName}.signed`;

        const utxo = cli(
            `cardano-cli query utxo ${NETWORK} --address ${driver.walletAddress}`
        );

        const txIn = utxo.split("\n")[2].split(" ")[0];

        cli(
            `cardano-cli transaction build \
            ${NETWORK} \
            --tx-in ${txIn} \
            --tx-out "${driver.walletAddress}+1500000 + 1 ${POLICY_ID}.${tokenHex}" \
            --mint="1 ${POLICY_ID}.${tokenHex}" \
            --minting-script-file ${POLICY_SCRIPT} \
            --metadata-json-file ${metadataPath} \
            --out-file ${txFile}`
        );

        cli(
            `cardano-cli transaction sign \
            --tx-body-file ${txFile} \
            --signing-key-file ${SKEY_PATH} \
            ${NETWORK} \
            --out-file ${signedTxFile}`
        );

        const txHash = cli(
            `cardano-cli transaction submit \
            ${NETWORK} \
            --tx-file ${signedTxFile}`
        );

        // Save NFT info to driver
        driver.cardanoIdentity = {
            tokenName,
            tokenId: `${POLICY_ID}.${tokenHex}`,
            txHash: txHash.trim(),
        };
        await driver.save();

        // ✅ Return tokenId as well
        return res.status(201).json({
            success: true,
            message: "Driver identity minted successfully",
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
 * MINT VEHICLE IDENTITY
 */
export const mintVehicleIdentity = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.body;

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle)
            return res.status(404).json({ success: false, message: "Vehicle not found" });

        const tokenName = generateTokenName();
        const tokenHex = Buffer.from(tokenName).toString("hex");

        const metadata = {
            "721": {
                [POLICY_ID]: {
                    [tokenName]: {
                        plateNumber: vehicle.plateNumber,
                        vin: vehicle.vin,
                        model: vehicle.model,
                        color: vehicle.color,
                        owner: vehicle.ownerId,
                        issued: new Date().toISOString(),
                        type: "VEHICLE_IDENTITY",
                    },
                },
            },
        };

        const metadataPath = path.join("tmp", `meta-${tokenName}.json`);
        fs.writeFileSync(metadataPath, JSON.stringify(metadata));

        const txFile = `tmp/tx-${tokenName}.raw`;
        const signedTxFile = `tmp/tx-${tokenName}.signed`;

        const utxo = cli(
            `cardano-cli query utxo ${NETWORK} --address ${vehicle.walletAddress}`
        );

        const txIn = utxo.split("\n")[2].split(" ")[0];

        cli(
            `cardano-cli transaction build \
            ${NETWORK} \
            --tx-in ${txIn} \
            --tx-out "${vehicle.walletAddress}+1500000 + 1 ${POLICY_ID}.${tokenHex}" \
            --mint="1 ${POLICY_ID}.${tokenHex}" \
            --minting-script-file ${POLICY_SCRIPT} \
            --metadata-json-file ${metadataPath} \
            --out-file ${txFile}`
        );

        cli(
            `cardano-cli transaction sign \
            --tx-body-file ${txFile} \
            --signing-key-file ${SKEY_PATH} \
            ${NETWORK} \
            --out-file ${signedTxFile}`
        );

        const txHash = cli(
            `cardano-cli transaction submit \
            ${NETWORK} \
            --tx-file ${signedTxFile}`
        );

        // Save NFT info to vehicle
        vehicle.cardanoIdentity = {
            tokenName,
            tokenId: `${POLICY_ID}.${tokenHex}`,
            txHash: txHash.trim(),
        };
        await vehicle.save();

        // ✅ Return tokenId as well
        return res.status(201).json({
            success: true,
            message: "Vehicle identity minted successfully",
            tokenName,
            tokenId: vehicle.cardanoIdentity.tokenId,
            txHash: vehicle.cardanoIdentity.txHash,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Minting failed", error: error.message });
    }
};


/**
 * GET DRIVER IDENTITY
 */
export const getDriverIdentity = async (req: Request, res: Response) => {
    try {
        const { tokenId } = req.params;
        const metadata = await blockfrost.assetsById(tokenId);
        return res.status(200).json(metadata);
    } catch (error: any) {
        res.status(500).json({ message: "Failed", error: error.message });
    }
};

/**
 * GET VEHICLE IDENTITY
 */
export const getVehicleIdentity = async (req: Request, res: Response) => {
    try {
        const { tokenId } = req.params;
        const metadata = await blockfrost.assetsById(tokenId);
        return res.status(200).json(metadata);
    } catch (error: any) {
        res.status(500).json({ message: "Failed", error: error.message });
    }
};
