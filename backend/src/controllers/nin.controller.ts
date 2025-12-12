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
        };

        const fullName = `${biodata.firstName} ${biodata.lastName}`;

        // Include all required fields for driver registration
        return res.status(200).json({
            success: true,
            data: {
                nin,           // ✅ Include NIN
                fullName,      // ✅ Include fullName
                dob: biodata.dob, // ✅ Include DOB
                gender: biodata.gender, // ✅ Include Gender
                state: biodata.state,
                lga: biodata.lga,
                languages: biodata.languages,
                maritalStatus: biodata.maritalStatus,
                occupation: biodata.occupation
            },
        });

    } catch (error) {
        console.error("NIN verification error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
