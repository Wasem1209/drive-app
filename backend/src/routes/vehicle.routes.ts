import express from "express";
import { registerVehicle } from "../controllers/vehicleController";
import { mintDriverIdentity, mintVehicleIdentity } from "../controllers/cardano.controller";

const router = express.Router();

router.post("/register", registerVehicle);
// Mint Vehicle Identity NFT
router.post("/cardano/vehicle-identity", mintVehicleIdentity);

export default router;
