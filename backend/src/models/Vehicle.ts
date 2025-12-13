import mongoose, { Schema, Document } from "mongoose";

export interface IVehicle extends Document {
    plateNumber: string;
    vin: string;
    vehicleModel: string;
    color: string;
}

const VehicleSchema = new Schema<IVehicle>(
    {
        plateNumber: { type: String, required: true },
        vin: { type: String, required: true },
        vehicleModel: { type: String, required: true },
        color: { type: String, required: true }
    },
    { timestamps: true }
);

export default mongoose.model<IVehicle>("Vehicle", VehicleSchema);
