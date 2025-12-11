import React, { useState } from "react";
import "./Profile.css";

// BASE URL
const BASE_URL = "https://drive-app-2-r58o.onrender.com";

export default function Profile() {
    const [nin, setNin] = useState("");
    const [ninData, setNinData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [driverImage, setDriverImage] = useState(null);
    const [driverImageUrl, setDriverImageUrl] = useState("");

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [walletAddress, setWalletAddress] = useState("");

    const [mintResult, setMintResult] = useState(null);

    // 🔵 1. VERIFY NIN
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

            if (!data.success) {
                setError(data.message);
            } else {
                setNinData(data.data);
            }
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Network error while verifying NIN.");
        }

        setLoading(false);
    };

    // 🔵 2. UPLOAD DRIVER IMAGE → IPFS
    const uploadDriverImage = async () => {
        if (!driverImage) {
            alert("Please select an image");
            return;
        }

        const formData = new FormData();
        formData.append("file", driverImage);

        try {
            const res = await fetch(`${BASE_URL}/upload/image`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setDriverImageUrl(data.ipfsUrl);
            } else {
                alert("Upload failed.");
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            alert("Network error during image upload.");
        }
    };

    // 🔵 3. REGISTER DRIVER IN DATABASE
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

                    walletAddress,
                    driverImage: driverImageUrl,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.message);
            } else {
                alert("Driver registered successfully!");
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setError("Registration failed.");
        }

        setLoading(false);
    };

    // 🔵 4. MINT DRIVER IDENTITY NFT
    const mintDriverIdentity = async () => {
        setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/cardano/driver-identity`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nin: ninData.nin,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.message);
            } else {
                setMintResult(data);
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setError("Minting failed.");
        }

        setLoading(false);
    };

    return (
        <div className="profile-container">

            {/* 1. VERIFY NIN */}
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

            {/* 2. UPLOAD DRIVER IMAGE */}
            <div className="card">
                <h2>Upload Driver Image</h2>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setDriverImage(e.target.files[0])}
                />

                <button onClick={uploadDriverImage}>Upload Image</button>

                {driverImageUrl && (
                    <p className="success">Uploaded → {driverImageUrl}</p>
                )}
            </div>

            {/* 3. REGISTER DRIVER */}
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

                <input
                    type="text"
                    placeholder="Wallet Address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                />

                <button onClick={registerDriver}>Register Driver</button>
            </div>

            {/* 4. MINT DRIVER NFT */}
            <div className="card">
                <h2>Mint Driver Identity NFT</h2>

                <button onClick={mintDriverIdentity}>Mint NFT</button>

                {mintResult && (
                    <div className="result-box">
                        <p><strong>Token:</strong> {mintResult.tokenName}</p>
                        <p><strong>Token ID:</strong> {mintResult.tokenId}</p>
                        <p><strong>Tx Hash:</strong> {mintResult.txHash}</p>
                    </div>
                )}
            </div>

        </div>
    );
}
