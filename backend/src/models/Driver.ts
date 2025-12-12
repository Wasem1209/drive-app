import mongoose, { Schema, Document } from "mongoose";

export interface IDriver extends Document {
    nin: string;
    fullName: string;
    dob: string;
    gender: string;
    phone?: string;
    city?: string;
    currentHomeAddress?: string;
    permanentHomeAddress?: string;
    occupation?: string;
    vehicleId?: string;
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

        phone: { type: String },
        city: { type: String },
        currentHomeAddress: { type: String },
        permanentHomeAddress: { type: String },
        occupation: { type: String },

        vehicleId: { type: String, default: null },

        cardanoIdentity: {
            tokenName: String,
            tokenId: String,
            txHash: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IDriver>("Driver", DriverSchema);
