import express from "express";
import { registerVehicle } from "../controllers/vehicleController";

const router = express.Router();

router.post("/register", registerVehicle);

export default router;
