import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User";
import { sendEmail } from "../utils/sendEmail";
import { generateToken } from "../utils/generateToken";


// REGISTER USER
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { fullName, email, phone, password, nin, role } = req.body;

        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate email verification token
        const verificationToken = crypto.randomBytes(40).toString("hex");

        const user = await User.create({
            fullName,
            email,
            phone,
            password: hashedPassword,
            nin,
            role,
            isVerified: false,
            verificationToken,
            verificationTokenExpires: Date.now() + 1000 * 60 * 30, // 30 minutes
        });

        const verifyURL = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

        // Send verification email
        await sendEmail(
            user.email,
            "Verify Your Email",
            `<h2>Hello ${user.fullName}</h2>
   <p>Click the link below to verify your email:</p>
   <a href="${verifyURL}">Verify Email</a>`
        );

        res.status(201).json({
            message: "Account created! Please check your email to verify your account.",
        });

    } catch (err: any) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};


// VERIFY EMAIL
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Email verified successfully!" });

    } catch (err: any) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};


// LOGIN USER
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // block unverified users
        if (!user.isVerified) {
            return res.status(400).json({ message: "Please verify your email first" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user._id.toString());

        res.status(200).json({ message: "Login successful", token });

    } catch (err: any) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};
