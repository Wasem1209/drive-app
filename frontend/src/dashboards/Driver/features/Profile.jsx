import React, { useState } from "react";
import "./Profile.css";

// BASE URL
const BASE_URL = "https://drive-app-2-r58o.onrender.com";



export default function Profile() {
    // --- Driver states ---
    const [nin, setNin] = useState("");
    const [ninData, setNinData] = useState(null);
    const [driverId, setDriverId] = useState(null);

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [driverMintResult, setDriverMintResult] = useState(null);

    // --- Vehicle states ---
    const [plateNumber, setPlateNumber] = useState("");
    const [vin, setVin] = useState("");
    const [model, setModel] = useState("");
    const [color, setColor] = useState("");

    const [vehicleId, setVehicleId] = useState(null);
    const [vehicleMintResult, setVehicleMintResult] = useState(null);

    // --- General states ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // --- 1. VERIFY NIN ---
    const handleVerifyNIN = async () => {
        setLoading(true);
        setError("");
        setNinData(null);

        try {
            const res = await fetch(`${BASE_URL}/nin/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nin }),
            });

            const data = await res.json();
            if (!data.success) setError(data.message);
            else setNinData(data.data);
        } catch {
            setError("Network error while verifying NIN.");
        }

        setLoading(false);
    };

    // --- 2. REGISTER DRIVER ---
    const registerDriver = async () => {
        if (!ninData) return alert("Verify NIN first.");
        setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/driver/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nin: ninData.nin,
                    fullName: ninData.fullName,
                    dob: ninData.dob,
                    gender: ninData.gender,
                    email,
                    phone,
                }),
            });

            const data = await res.json();
            if (!data.success) setError(data.message);
            else {
                setDriverId(data.driverId);
                alert(`Driver registered successfully! ID: ${data.driverId}`);
            }
        } catch {
            setError("Driver registration failed.");
        }

        setLoading(false);
    };

    // --- 3. REGISTER VEHICLE ---
    const registerVehicle = async () => {
        if (!driverId) return alert("Register driver first.");
        setLoading(true);

        try {
            const res = await fetch(`${VEHICLE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ownerId: driverId,
                    plateNumber,
                    vin,
                    model,
                    color,
                }),
            });

            const data = await res.json();
            if (!data.success) setError(data.message);
            else {
                setVehicleId(data.vehicleId);
                alert(`Vehicle registered successfully! ID: ${data.vehicleId}`);
            }
        } catch {
            setError("Vehicle registration failed.");
        }

        setLoading(false);
    };

    // --- 4. MINT DRIVER NFT ---
    const mintDriverIdentity = async () => {
        if (!driverId) return alert("Register driver first.");
        setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/cardano/driver-identity`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ driverId }),
            });

            const data = await res.json();
            if (!data.success) setError(data.message || "Minting failed");
            else setDriverMintResult({
                tokenName: data.tokenName,
                tokenId: data.tokenId,
                txHash: data.txHash,
            });
        } catch {
            setError("Driver NFT minting failed.");
        }

        setLoading(false);
    };

    // --- 5. MINT VEHICLE NFT ---
    const mintVehicleIdentity = async () => {
        if (!vehicleId) return alert("Register vehicle first.");
        setLoading(true);

        try {
            const res = await fetch(`${VEHICLE_URL}/cardano/vehicle-identity`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vehicleId }),
            });

            const data = await res.json();
            if (!data.success) setError(data.message || "Minting failed");
            else setVehicleMintResult({
                tokenName: data.tokenName,
                tokenId: data.tokenId,
                txHash: data.txHash,
            });
        } catch {
            setError("Vehicle NFT minting failed.");
        }

        setLoading(false);
    };

    return (
        <div className="profile-container">
            {/* VERIFY NIN */}
            <div className="card">
                <h2>Verify NIN</h2>
                <input
                    type="text"
                    placeholder="Enter NIN"
                    value={nin}
                    onChange={(e) => setNin(e.target.value)}
                />
                <button onClick={handleVerifyNIN}>Verify NIN</button>
                {loading && <p className="loading">Processing...</p>}
                {error && <p className="error">{error}</p>}
                {ninData && (
                    <div className="result-box">
                        <p><strong>Name:</strong> {ninData.fullName}</p>
                        <p><strong>DOB:</strong> {ninData.dob}</p>
                        <p><strong>Gender:</strong> {ninData.gender}</p>
                        <p><strong>State:</strong> {ninData.state}</p>
                        <p><strong>Local Gov:</strong> {ninData.local}</p>
                    </div>
                )}
            </div>

            {/* REGISTER DRIVER */}
            <div className="card">
                <h2>Register Driver</h2>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <button onClick={registerDriver}>Register Driver</button>
            </div>

            {/* MINT DRIVER NFT */}
            <div className="card">
                <h2>Mint Driver Identity NFT</h2>
                <button onClick={mintDriverIdentity}>Mint NFT</button>
                {driverMintResult && (
                    <div className="result-box">
                        <p><strong>Token:</strong> {driverMintResult.tokenName}</p>
                        <p><strong>Token ID:</strong> {driverMintResult.tokenId}</p>
                        <p><strong>Tx Hash:</strong> {driverMintResult.txHash}</p>
                    </div>
                )}
            </div>

            {/* REGISTER VEHICLE */}
            <div className="card">
                <h2>Register Vehicle</h2>
                <input
                    type="text"
                    placeholder="Plate Number"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="VIN"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
                <button onClick={registerVehicle}>Register Vehicle</button>
            </div>

            {/* MINT VEHICLE NFT */}
            <div className="card">
                <h2>Mint Vehicle Identity NFT</h2>
                <button onClick={mintVehicleIdentity}>Mint Vehicle NFT</button>
                {vehicleMintResult && (
                    <div className="result-box">
                        <p><strong>Token:</strong> {vehicleMintResult.tokenName}</p>
                        <p><strong>Token ID:</strong> {vehicleMintResult.tokenId}</p>
                        <p><strong>Tx Hash:</strong> {vehicleMintResult.txHash}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
