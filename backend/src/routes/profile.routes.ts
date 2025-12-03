import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import CarRecord from "../models/CarRecord.model";
import NinRecord from "../models/NinRecord";
import DriverAgreement from "../models/DriverAgreement.model";

const router = express.Router();

/**
 * 1️⃣ Get Personal Info (name + email)
 */
router.get("/me", authMiddleware, async (req: any, res) => {
    const { name, email } = req.user;
    res.json({ name, email });
});

/**
 * 2️⃣ Save Car Plate + fetch backend data
 */
router.post("/car", authMiddleware, async (req: any, res) => {
    const { plateNumber } = req.body;

    // FAKE BACKEND DATA (for hackathon)
    const mockCarData = {
        carMake: "Toyota",
        carModel: "Corolla",
        carYear: "2018",
    };

    const car = await CarRecord.create({
        userId: req.user.id,
        plateNumber,
        ...mockCarData,
        fetchedData: mockCarData,
    });

    res.json({ message: "Car data saved", data: car });
});

/**
 * 3️⃣ Fetch NIN data and save
 */
router.post("/nin", authMiddleware, async (req: any, res) => {
    const { nin } = req.body;

    const mockNinData = {
        firstname: "David",
        lastname: "Johnson",
        age: 29,
        gender: "Male",
    };

    const ninRecord = await NinRecord.create({
        userId: req.user.id,
        nin,
        ninData: mockNinData,
    });

    res.json({ message: "NIN data saved", data: ninRecord });
});

/**
 * 4️⃣ Save Driver Agreement (only once)
 */
router.post("/agreement", authMiddleware, async (req: any, res) => {
    const exists = await DriverAgreement.findOne({ userId: req.user.id });

    if (exists) {
        return res.status(400).json({ message: "Agreement already accepted" });
    }

    const agreement = await DriverAgreement.create({
        userId: req.user.id,
        accepted: true,
    });

    res.json({ message: "Agreement saved", data: agreement });
});

export default router;
