import { Router } from "express";
import { verifyNIN } from "../controllers/nin.controller";
import { uploadImage } from "../controllers/upload.controller";
import { registerDriver } from "../controllers/p.controller";
import { mintDriverIdentity, mintVehicleIdentity } from "../controllers/cardano.controller";

const router = Router();

// NIN verification
router.post("/nin/verify", verifyNIN);

// Upload driver / vehicle image → IPFS
router.post("/upload/image", uploadImage);

// Register driver + vehicle into MongoDB
router.post("/driver/register", registerDriver);

// Mint Driver Identity NFT
router.post("/cardano/driver-identity", mintDriverIdentity);

// Mint Vehicle Identity NFT
router.post("/cardano/vehicle-identity", mintVehicleIdentity);

export default router;
