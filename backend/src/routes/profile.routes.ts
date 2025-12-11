import { Router } from "express";
import { verifyNIN } from "../controllers/nin.controller";
import { uploadImage } from "../controllers/upload.controller";
import { registerDriver } from "../controllers/Driver.controller";
import { mintDriverIdentity, mintVehicleIdentity } from "../controllers/cardano.controller";

const router = Router();

// NIN verification box
router.post("/nin/verify", verifyNIN);


// Register driver + vehicle into MongoDB
router.post("/driver/register", registerDriver);

// Mint Driver Identity NFT
router.post("/cardano/driver-identity", mintDriverIdentity);

// Mint Vehicle Identity NFT
router.post("/cardano/vehicle-identity", mintVehicleIdentity);

export default router;
