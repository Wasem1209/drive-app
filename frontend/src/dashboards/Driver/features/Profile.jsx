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
    // VERIFY NIN
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
    // REGISTER VEHICLE
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
    // MINT DRIVER IDENTITY NFT
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
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
            <div className="max-w-4xl w-full">

                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Driver Identity & Vehicle Registration
                </h1>

                {/* ERROR */}
                {error && (
                    <div className="bg-red-200 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* LOADING */}
                {loading && (
                    <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4">
                        Processing... Please wait
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">

                    {/* DRIVER PROFILE */}
                    <div className="bg-white shadow-md rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-4">Driver Profile</h2>

                        <input
                            name="fullName"
                            placeholder="Full Name"
                            className="input-box"
                            value={profile.fullName}
                            onChange={handleChange}
                        />

                        <input
                            name="nin"
                            placeholder="Enter NIN"
                            className="input-box"
                            value={profile.nin}
                            onChange={handleChange}
                        />

                        <button className="btn-primary mt-2" onClick={verifyNIN}>
                            Verify NIN
                        </button>

                        {ninData && (
                            <div className="bg-green-100 p-3 rounded mt-4">
                                <p><strong>Name:</strong> {ninData.fullName}</p>
                                <p><strong>Gender:</strong> {ninData.gender}</p>
                                <p><strong>DOB:</strong> {ninData.dob}</p>
                            </div>
                        )}

                        <button className="btn-secondary mt-4" onClick={mintProfileNFT}>
                            Mint Identity NFT
                        </button>

                        {mintStatus && (
                            <div className="bg-green-100 p-3 rounded mt-4">
                                <p className="font-bold text-green-700">NFT Minted!</p>
                                <p>TX Hash: {mintStatus.txHash}</p>
                            </div>
                        )}
                    </div>

                    {/* VEHICLE REGISTRATION */}
                    <div className="bg-white shadow-md rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-4">Vehicle Registration</h2>

                        <input
                            name="plateNumber"
                            placeholder="Plate Number"
                            className="input-box"
                            value={profile.plateNumber}
                            onChange={handleChange}
                        />

                        <input
                            name="vehicleType"
                            placeholder="Vehicle Type"
                            className="input-box"
                            value={profile.vehicleType}
                            onChange={handleChange}
                        />

                        <input
                            name="color"
                            placeholder="Vehicle Color"
                            className="input-box"
                            value={profile.color}
                            onChange={handleChange}
                        />

                        <button className="btn-primary mt-2" onClick={registerVehicle}>
                            Register Vehicle
                        </button>

                        {vehicleStatus && (
                            <div className="bg-green-100 p-3 rounded mt-4">
                                <p className="font-bold text-green-700">
                                    Vehicle stored on blockchain.
                                </p>
                                <p>TX Hash: {vehicleStatus.txHash}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL */}
                {modal.open && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
                            <h3 className="text-xl font-bold mb-2">Success</h3>
                            <p>{modal.message}</p>

                            <button
                                onClick={() => setModal({ open: false, message: "" })}
                                className="btn-primary mt-4"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;