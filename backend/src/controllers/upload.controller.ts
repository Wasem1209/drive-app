import { Request, Response } from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";

const upload = multer({ dest: "uploads/" }).single("file");

export const uploadImage = (req: Request, res: Response) => {
    upload(req, res, async (err: any) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Upload error",
            });
        }

        const uploadedFile = (req as any).file;
        if (!uploadedFile) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const filePath = uploadedFile.path;

        try {
            const fileBuffer = fs.readFileSync(filePath);

            const ipfsRes = await axios.post(
                "https://ipfs.blockfrost.io/api/v0/ipfs/add",
                fileBuffer,
                {
                    headers: {
                        "Content-Type": "application/octet-stream",
                        project_id: process.env.BLOCKFROST_IPFS_KEY,
                    },
                }
            );

            fs.unlinkSync(filePath); // cleanup temp file

            return res.json({
                success: true,
                ipfsUrl: `ipfs://${ipfsRes.data.ipfs_hash}`,
            });
        } catch (error: any) {
            console.error("IPFS Upload Error:", error?.response?.data || error.message);

            return res.status(500).json({
                success: false,
                message: "IPFS Upload Failed",
            });
        }
    });
};
