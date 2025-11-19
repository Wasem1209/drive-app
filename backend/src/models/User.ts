import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    role: "driver" | "passenger" | "officer" | "admin";
    drivingLicense?: string;
    age?: number;
    securityID?: string;
    unitOrArm?: string;
    currentHomeAddress?: string;
    localHomeAddress?: string;
    isVerified?: boolean;
    verificationToken?: string;
    verificationTokenExpires?: number;
}

const UserSchema = new Schema<IUser>(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["driver", "passenger", "officer", "admin"],
            required: true,
        },
        drivingLicense: { type: String },
        age: { type: Number },
        securityID: { type: String },
        unitOrArm: { type: String },
        currentHomeAddress: { type: String },
        localHomeAddress: { type: String },
        isVerified: { type: Boolean, default: false },
        verificationToken: { type: String },
        verificationTokenExpires: { type: Number },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
