import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "driver" | "passenger" | "officer" | "admin";

export interface IProfile extends Document {
    userId: mongoose.Types.ObjectId;
    role: UserRole;
    name: string;
    email: string;
    phone?: string;
    licenseNumber?: string;     // driver only
    vehicleNumber?: string;     // driver only
    address?: string;
    profilePicture?: string;
    walletAddress?: string;
    department?: string;        // officer/admin
    otherInfo?: string;
}

const ProfileSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Types.ObjectId, required: true, ref: "User", unique: true },
        role: { type: String, enum: ["driver", "passenger", "officer", "admin"], required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        licenseNumber: { type: String },
        vehicleNumber: { type: String },
        address: { type: String },
        profilePicture: { type: String },
        walletAddress: { type: String },
        department: { type: String },
        otherInfo: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IProfile>("Profile", ProfileSchema);
