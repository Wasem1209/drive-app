import React, { useState } from "react";
import axios from "axios";
import "./Profile.css";

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

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // -----------------------------
    // 1. VERIFY NIN
    // -----------------------------
    const verifyNIN = async () => {
        if (!profile.nin) return setError("Enter your NIN first.");

        setError("");
        setLoading(true);

        try {
            const res = await axios.post("/api/nin/verify", { nin: profile.nin });

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

    // -----------------------------
    // 2. REGISTER VEHICLE
    // -----------------------------
    const registerVehicle = async () => {
        if (!profile.plateNumber || !profile.vehicleType || !profile.color) {
            return setError("All vehicle fields are required.");
        }

        setError("");
        setLoading(true);

        try {
            const res = await axios.post("/api/vehicle/register", {
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

    // -----------------------------
    // 3. MINT DRIVER IDENTITY NFT
    // -----------------------------
    const mintProfileNFT = async () => {
        if (!profile.fullName || !profile.nin) {
            return setError("Full name & NIN are required.");
        }

        setError("");
        setLoading(true);

        try {
            const res = await axios.post("/api/blockchain/mint-identity", {
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

    return (
        <PhoneFrame>
        <div className="profile-container">
            {/* ERROR */}
            {error && <div className="error">{error}</div>}

            {/* LOADING */}
            {loading && <div className="loading">Processing... Please wait</div>}

            {/* =======================
          DRIVER PROFILE
      ======================== */}
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

                <button className="agree-btn" onClick={verifyNIN}>
                    Verify NIN
                </button>

                {ninData && (
                    <div className="result-box">
                        <p><strong>Name:</strong> {ninData.fullName}</p>
                        <p><strong>Gender:</strong> {ninData.gender}</p>
                        <p><strong>DOB:</strong> {ninData.dob}</p>
                    </div>
                )}

                <button onClick={mintProfileNFT}>Mint Identity NFT</button>

                {mintStatus && (
                    <div className="result-box">
                        <p className="success">Identity NFT minted!</p>
                        <p>TX Hash: {mintStatus.txHash}</p>
                    </div>
                )}
            </div>

            {/* =======================
          VEHICLE REGISTRATION
      ======================== */}
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
                        <p className="success">Vehicle identity stored on blockchain.</p>
                        <p>TX Hash: {vehicleStatus.txHash}</p>
                    </div>
                )}
            </div>

            {/* =======================
          MODAL
      ======================== */}
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
            </PhoneFrame>
    );
};

export default Profile;
