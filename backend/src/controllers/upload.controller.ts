import { Request, Response } from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";

const upload = multer({ dest: "uploads/" }).single("file");

export const uploadImage = (req: Request, res: Response) => {
    upload(req, res, async (err: any) => {
        if (err) return res.status(500).json({ success: false, message: "Upload error" });

        const uploadedFile = (req as any).file; // FIX
        if (!uploadedFile) return res.status(400).json({ success: false, message: "No file uploaded" });

        const filePath = uploadedFile.path; // FIX

        try {
            const file = fs.readFileSync(filePath);

            const response = await axios.post(
                "https://ipfs.blockfrost.io/api/v0/ipfs/add",
                file,
                {
                    headers: {
                        "Content-Type": "application/octet-stream",
                        project_id: process.env.BLOCKFROST_IPFS_KEY,
                    },
                }
            );

            // Delete tmp file
            fs.unlinkSync(filePath);

            return res.json({
                success: true,
                ipfsUrl: `ipfs://${response.data.ipfs_hash}`,
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "IPFS Upload Failed" });
        }
    });
};
