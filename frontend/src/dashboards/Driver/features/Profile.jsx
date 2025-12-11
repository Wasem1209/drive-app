import React, { useState } from "react";
import axios from "axios";
import "./Profile.css";

// Correct backend URL
const BASE_URL = "https://drive-app-2-r58o.onrender.com/api/profile";

const Profile = () => {
    const [profile, setProfile] = useState({
        fullName: "",
        nin: "",
        plateNumber: "",
        vehicleType: "",
        color: "",
    });

    const [loading, setLoading] = useState(false);
    const [ninData, setNinData] = useState(null);
    const [, setVehicleStatus] = useState(null);
    const [driverMintStatus, setDriverMintStatus] = useState(null);
    const [vehicleMintStatus, setVehicleMintStatus] = useState(null);
    const [modal, setModal] = useState({ open: false, message: "" });
    const [error, setError] = useState("");

    // IMAGE UPLOAD STATES
    const [imageFiles, setImageFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // ======================================
    // VERIFY NIN (Mints NIN to blockchain)
    // ======================================
    const verifyNIN = async () => {
        if (!profile.nin) return setError("Enter your NIN first.");
        setError("");
        setLoading(true);

        try {
            const res = await axios.post(`${BASE_URL}/nin/verify`, {
                nin: profile.nin,
            });

            setNinData(res.data.data);

            setModal({
                open: true,
                message: "NIN verified and stored on Cardano Blockchain!",
            });
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Unable to verify NIN.");
        } finally {
            setLoading(false);
        }
    };

    // ======================================
    // REGISTER VEHICLE (Send to DB)
    // ======================================
    const registerVehicle = async () => {
        if (!profile.plateNumber || !profile.vehicleType || !profile.color) {
            return setError("All vehicle fields are required.");
        }

        setError("");
        setLoading(true);

        try {
            const res = await axios.post(`${BASE_URL}/driver/register`, {
                plateNumber: profile.plateNumber,
                vehicleType: profile.vehicleType,
                color: profile.color,
            });

            setVehicleStatus(res.data);

            setModal({
                open: true,
                message: "Vehicle Registered Successfully!",
            });
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Vehicle registration failed.");
        } finally {
            setLoading(false);
        }
    };

    // ======================================
    // MINT DRIVER NFT ON CARDANO
    // ======================================
    const mintDriverIdentity = async () => {
        if (!profile.fullName || !profile.nin) {
            return setError("Full name & NIN are required.");
        }

        setError("");
        setLoading(true);

        try {
            const res = await axios.post(`${BASE_URL}/cardano/driver-identity`, {
                fullName: profile.fullName,
                nin: profile.nin,
            });

            setDriverMintStatus(res.data);

            setModal({
                open: true,
                message: "Driver Identity NFT Minted Successfully!",
            });
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Failed to mint driver identity NFT.");
        } finally {
            setLoading(false);
        }
    };

    // ======================================
    // MINT VEHICLE NFT ON CARDANO
    // ======================================
    const mintVehicleIdentity = async () => {
        if (!profile.plateNumber || !profile.vehicleType || !profile.color) {
            return setError("Register vehicle first.");
        }

        setError("");
        setLoading(true);

        try {
            const res = await axios.post(`${BASE_URL}/cardano/vehicle-identity`, {
                plateNumber: profile.plateNumber,
                vehicleType: profile.vehicleType,
                color: profile.color,
            });

            setVehicleMintStatus(res.data);

            setModal({
                open: true,
                message: "Vehicle Identity NFT Minted Successfully!",
            });
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Vehicle NFT minting failed.");
        } finally {
            setLoading(false);
        }
    };

    // ======================================
    // IMAGE PREVIEW HANDLER
    // ======================================
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(files);

        const previews = files.map((f) => URL.createObjectURL(f));
        setPreviewUrls(previews);
    };

    // ======================================
    // UPLOAD IMAGES → IPFS
    // ======================================
    const uploadImages = async () => {
        if (imageFiles.length === 0) return setError("Select at least one image first.");

        setError("");
        setLoading(true);

        try {
            const formData = new FormData();
            imageFiles.forEach((file) => formData.append("images", file));

            await axios.post(`${BASE_URL}/upload/image`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setModal({
                open: true,
                message: "Images uploaded successfully to IPFS!",
            });
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Image upload failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            {error && <div className="error">{error}</div>}
            {loading && <div className="loading">Processing... Please wait</div>}

            {/* DRIVER PROFILE */}
            <div className="card">
                <h2>Driver Profile</h2>

                <input name="fullName" placeholder="Full Name" onChange={handleChange} />
                <input name="nin" placeholder="Enter NIN" onChange={handleChange} />

                <button onClick={verifyNIN}>Verify NIN</button>

                {ninData && (
                    <div className="result-box">
                        <p><strong>Name:</strong> {ninData.fullName}</p>
                        <p><strong>Gender:</strong> {ninData.gender}</p>
                        <p><strong>DOB:</strong> {ninData.dob}</p>
                    </div>
                )}

                <button className="agree-btn" onClick={mintDriverIdentity}>
                    Mint Driver NFT
                </button>

                {driverMintStatus && (
                    <div className="result-box">
                        <p className="success">Driver NFT Minted!</p>
                        <p>TX Hash: {driverMintStatus.txHash}</p>
                    </div>
                )}
            </div>

            {/* VEHICLE */}
            <div className="card">
                <h2>Vehicle Registration</h2>

                <input name="plateNumber" placeholder="Plate Number" onChange={handleChange} />
                <input name="vehicleType" placeholder="Vehicle Type" onChange={handleChange} />
                <input name="color" placeholder="Vehicle Color" onChange={handleChange} />

                <button onClick={registerVehicle}>Register Vehicle</button>

                <button className="agree-btn" onClick={mintVehicleIdentity}>
                    Mint Vehicle NFT
                </button>

                {vehicleMintStatus && (
                    <div className="result-box">
                        <p className="success">Vehicle NFT Minted!</p>
                        <p>TX Hash: {vehicleMintStatus.txHash}</p>
                    </div>
                )}
            </div>

            {/* IMAGE UPLOAD */}
            <div className="card">
                <h2>Upload Driver / Vehicle Images</h2>

                <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

                {previewUrls.length > 0 && (
                    <div className="preview-grid">
                        {previewUrls.map((url, i) => (
                            <div key={i} className="preview-item">
                                <img src={url} alt="Preview" className="preview-img" />
                            </div>
                        ))}
                    </div>
                )}

                <button onClick={uploadImages}>Upload Images</button>
            </div>

            {/* MODAL */}
            {modal.open && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Success</h3>
                        <p>{modal.message}</p>
                        <button onClick={() => setModal({ open: false, message: "" })}>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
