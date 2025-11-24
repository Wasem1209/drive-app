import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";

// -----------------------------
// REGISTER USER
// -----------------------------
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password, role } = req.body;

        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role,
            isVerified: true, // since no email verification
        });

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            role: user.role,
        });

    } catch (err: any) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// -----------------------------
// LOGIN USER
// -----------------------------
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id.toString());

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            role: user.role, // needed for frontend redirect
        });

    } catch (err: any) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};
