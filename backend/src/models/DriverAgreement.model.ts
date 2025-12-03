import mongoose, { Schema, Document } from "mongoose";

export interface IDriverAgreement extends Document {
    userId: string;
    accepted: boolean;
}

const DriverAgreementSchema: Schema = new Schema(
    {
        userId: { type: String, required: true },
        accepted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model<IDriverAgreement>(
    "DriverAgreement",
    DriverAgreementSchema
);
