import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing in .env");
    }

    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // token valid for 7 days
    );
};
