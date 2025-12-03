import mongoose, { Schema, Document } from "mongoose";

export interface ICarRecord extends Document {
    userId: string;
    plateNumber: string;
    carMake?: string;
    carModel?: string;
    carYear?: string;
    fetchedData?: any;
}

const CarRecordSchema: Schema = new Schema(
    {
        userId: { type: String, required: true },
        plateNumber: { type: String, required: true },
        carMake: String,
        carModel: String,
        carYear: String,
        fetchedData: Object,
    },
    { timestamps: true }
);

export default mongoose.model<ICarRecord>("CarRecord", CarRecordSchema);
