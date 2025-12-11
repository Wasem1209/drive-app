import { Request, Response } from "express";

// Mock NIN verification (hackathon safe)
export const verifyNIN = async (req: Request, res: Response) => {
    try {
        const { nin } = req.body;

        if (!nin || nin.length !== 11) {
            return res.status(400).json({ success: false, message: "Invalid NIN" });
        }

        const biodata = {
            firstName: "Philip",
            lastName: "Wasem",
            dob: "1995-05-20",
            gender: "Male",
            state: "Abuja",
            lga: "Gwagwalada",
            languages: ["English", "Hausa"],
            maritalStatus: "Single",
            occupation: "Software Developer"
        }

        return res.status(200).json({
            success: true,
            data: biodata,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
