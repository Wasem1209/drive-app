import { Request, Response } from "express";
import Profile, { UserRole } from "../models/profile";

interface AuthRequest extends Request {
    user?: { id: string, role: UserRole };
}

export const setupProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;

        if (!userId || !role) return res.status(401).json({ message: "Not authorized" });

        const { name, email, phone, licenseNumber, vehicleNumber, address, profilePicture, walletAddress, department, otherInfo } = req.body;

        let profile = await Profile.findOne({ userId });

        if (profile) {
            // Update profile
            profile.name = name || profile.name;
            profile.email = email || profile.email;
            profile.phone = phone || profile.phone;
            profile.licenseNumber = role === "driver" ? licenseNumber || profile.licenseNumber : undefined;
            profile.vehicleNumber = role === "driver" ? vehicleNumber || profile.vehicleNumber : undefined;
            profile.address = address || profile.address;
            profile.profilePicture = profilePicture || profile.profilePicture;
            profile.walletAddress = walletAddress || profile.walletAddress;
            profile.department = role === "officer" || role === "admin" ? department || profile.department : undefined;
            profile.otherInfo = otherInfo || profile.otherInfo;

            await profile.save();
            return res.status(200).json({ message: "Profile updated", profile });
        } else {
            // Create profile
            profile = await Profile.create({
                userId,
                role,
                name,
                email,
                phone,
                licenseNumber: role === "driver" ? licenseNumber : undefined,
                vehicleNumber: role === "driver" ? vehicleNumber : undefined,
                address,
                profilePicture,
                walletAddress,
                department: role === "officer" || role === "admin" ? department : undefined,
                otherInfo,
            });
            return res.status(201).json({ message: "Profile created", profile });
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
