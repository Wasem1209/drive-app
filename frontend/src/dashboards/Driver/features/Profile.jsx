import React, { useState } from "react";
import axios from "axios";
import "./Profile.css";

// BASE URL for your backend
const BASE_URL = "https://drive-app-2-r58o.onrender.com";

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
    const [vehicleStatus, setVehicleStatus] = useState(null);
    const [mintStatus, setMintStatus] = useState(null);
    const [modal, setModal] = useState({ open: false, message: "" });
    const [error, setError] = useState("");

    // IMAGE UPLOAD STATES
    const [imageFiles, setImageFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // ======================================
    // VERIFY NIN
    // ======================================
    const verifyNIN = async () => {
        if (!profile.nin) return setError("Enter your NIN first.");
        setError("");
        setLoading(true);

        try {
            const res = await axios.post(`${BASE_URL}/api/profile/nin/verify`, {
                nin: profile.nin,
            });
            setNinData(res.data.data);
            setModal({
                open: true,
                message: "NIN verified successfully and stored on Cardano Blockchain!",
            });
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Unable to verify NIN.");
        } finally {
            setLoading(false);
        }
    };

    // ======================================
    // REGISTER VEHICLE
    // ======================================
    const registerVehicle = async () => {
        if (!profile.plateNumber || !profile.vehicleType || !profile.color) {
            return setError("All vehicle fields are required.");
        }

        setError("");
        setLoading(true);

        try {
            const res = await axios.post(`${BASE_URL}/api/profile/driver/register`, {
                plateNumber: profile.plateNumber,
                vehicleType: profile.vehicleType,
                color: profile.color,
            });

            setVehicleStatus(res.data);
            setModal({
                open: true,
                message: "Vehicle registered & identity stored on the Blockchain!",
            });
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Vehicle registration failed.");
        } finally {
            setLoading(false);
        }
    };

    // ======================================
    // MINT DRIVER NFT
    // ======================================
    const mintProfileNFT = async () => {
        if (!profile.fullName || !profile.nin) {
            return setError("Full name & NIN are required.");
        }

        setError("");
        setLoading(true);

        try {
            const res = await axios.post(`${BASE_URL}/api/profile/cardano/driver-identity`, {
                fullName: profile.fullName,
                nin: profile.nin,
            });

            setMintStatus(res.data);
            setModal({
                open: true,
                message: "Driver Identity NFT minted successfully!",
            });
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Failed to mint identity NFT.");
        } finally {
            setLoading(false);
        }
    };

    // ======================================
    // IMAGE HANDLER
    // ======================================
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(files);

        const previews = files.map((f) => URL.createObjectURL(f));
        setPreviewUrls(previews);
    };

    // ======================================
    // UPLOAD IMAGES → BACKEND
    // ======================================
    const uploadImages = async () => {
        if (imageFiles.length === 0) return setError("Select at least one image first.");

        setError("");
        setLoading(true);

        try {
            const formData = new FormData();
            imageFiles.forEach((file) => formData.append("images", file));

            await axios.post(`${BASE_URL}/api/profile/upload/image`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setModal({
                open: true,
                message: "Images uploaded successfully!",
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

                <input
                    name="fullName"
                    placeholder="Full Name"
                    value={profile.fullName}
                    onChange={handleChange}
                />
                <input
                    name="nin"
                    placeholder="Enter NIN"
                    value={profile.nin}
                    onChange={handleChange}
                />

                <button onClick={verifyNIN}>Verify NIN</button>

                {ninData && (
                    <div className="result-box">
                        <p><strong>Name:</strong> {ninData.fullName}</p>
                        <p><strong>Gender:</strong> {ninData.gender}</p>
                        <p><strong>DOB:</strong> {ninData.dob}</p>
                    </div>
                )}

                <button className="agree-btn" onClick={mintProfileNFT}>
                    Mint Identity NFT
                </button>

                {mintStatus && (
                    <div className="result-box">
                        <p className="success">NFT Minted!</p>
                        <p>TX Hash: {mintStatus.txHash}</p>
                    </div>
                )}
            </div>

            {/* VEHICLE REGISTRATION */}
            <div className="card">
                <h2>Vehicle Registration</h2>

                <input
                    name="plateNumber"
                    placeholder="Plate Number"
                    value={profile.plateNumber}
                    onChange={handleChange}
                />
                <input
                    name="vehicleType"
                    placeholder="Vehicle Type"
                    value={profile.vehicleType}
                    onChange={handleChange}
                />
                <input
                    name="color"
                    placeholder="Vehicle Color"
                    value={profile.color}
                    onChange={handleChange}
                />

                <button onClick={registerVehicle}>Register Vehicle</button>

                {vehicleStatus && (
                    <div className="result-box">
                        <p className="success">Vehicle stored on blockchain.</p>
                        <p>TX Hash: {vehicleStatus.txHash}</p>
                    </div>
                )}
            </div>

            {/* IMAGE UPLOAD */}
            <div className="card">
                <h2>Upload Driver / Vehicle Images</h2>

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                />

                {previewUrls.length > 0 && (
                    <div className="preview-grid">
                        <div className="preview-item">
                            <label>Front View</label>
                            <img
                                src={previewUrls[0]}
                                alt="Front View"
                                className="preview-img"
                            />
                        </div>
                        <div className="preview-item">
                            <label>Back View</label>
                            <img
                                src={previewUrls[1]}
                                alt="Back View"
                                className="preview-img"
                            />
                        </div>
                        <div className="preview-item">
                            <label>Plate Number</label>
                            <img
                                src={previewUrls[2]}
                                alt="Plate Number"
                                className="preview-img"
                            />
                        </div>
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
