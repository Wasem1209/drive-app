import mongoose, { Schema, Document } from "mongoose";

export interface IDriverProfile extends Document {
    userId: string;
    name?: string;
    email?: string;
    carInfo?: any;
    ninInfo?: any;
    acceptedTerms: boolean;
}

const DriverProfileSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, unique: true },
        name: { type: String },
        email: { type: String },
        carInfo: { type: Object },
        ninInfo: { type: Object },
        acceptedTerms: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model<IDriverProfile>(
    "DriverProfile",
    DriverProfileSchema
);
