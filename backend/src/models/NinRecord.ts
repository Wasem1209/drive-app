import mongoose, { Schema, Document } from "mongoose";

export interface INinRecord extends Document {
    userId: string;
    nin: string;
    ninData?: any;
}

const NinRecordSchema: Schema = new Schema(
    {
        userId: { type: String, required: true },
        nin: { type: String, required: true },
        ninData: Object,
    },
    { timestamps: true }
);

export default mongoose.model<INinRecord>("NinRecord", NinRecordSchema);
