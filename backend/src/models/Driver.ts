import mongoose, { Schema, Document } from "mongoose";

export interface IDriver extends Document {
    nin: string;
    fullName: string;        // Changed from name → fullName
    dob: string;
    gender: string;
    email?: string;
    phone?: string;
    walletAddress: string;
    vehicleId?: string;      // NEW: link to vehicle
    cardanoIdentity?: {
        tokenName: string;
        tokenId: string;
        txHash: string;
    };
}

const DriverSchema = new Schema<IDriver>(
    {
        nin: { type: String, required: true },
        fullName: { type: String, required: true },
        dob: { type: String, required: true },
        gender: { type: String, required: true },

        email: { type: String, required: false },
        phone: { type: String, required: false },

        walletAddress: { type: String, required: true },

        vehicleId: { type: String, default: null }, // NEW FIELD

        cardanoIdentity: {
            tokenName: String,
            tokenId: String,
            txHash: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IDriver>("Driver", DriverSchema);
