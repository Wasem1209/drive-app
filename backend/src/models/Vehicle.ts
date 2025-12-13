import mongoose, { Schema, Document } from "mongoose";

export interface IVehicle extends Document {
    plateNumber: string;
    vin: string;
    vehicleModel: string;
    color: string;
    year: string;
    ownerId: string;
    walletAddress: string;

    cardanoIdentity?: {
        tokenName: string;
        tokenId: string;
        txHash: string;
    };
}

const VehicleSchema = new Schema<IVehicle>(
    {
        plateNumber: { type: String, required: true },
        vin: { type: String, required: true },
        vehicleModel: { type: String, required: true },
        color: { type: String, required: true },
        year: { type: String, required: false },

        ownerId: { type: String, required: true },

        walletAddress: { type: String, required: true },

        cardanoIdentity: {
            tokenName: String,
            tokenId: String,
            txHash: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IVehicle>("Vehicle", VehicleSchema);
