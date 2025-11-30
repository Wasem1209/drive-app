import React, { useState, useEffect, useCallback } from "react";
import '../../styles/Profile.css';
import ConnectWallet from './features/ConnectWallet';
import copy_icon from '../../assets/Copy.png';
import { ethers } from "ethers";
import DriverContractABI from '../../contracts/DriverContract.json'; // Add your ABI here

const DRIVER_CONTRACT_ADDRESS = "0xYourContractAddressHere";

export default function Profile({ profile, setProfile, walletAddress }) {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        licenseNumber: "",
        vehiclePlate: "",
        vehicleModel: "",
        vehicleYear: "",
        vehicleType: "",
    });

    const [driverOnChain, setDriverOnChain] = useState({
        insuranceDue: "",
        roadTaxDue: "",
        roadworthy: true,
        safeDrivingScore: 0,
    });

    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    // Fetch driver info from smart contract
    const fetchOnChainDriverData = useCallback(async () => {
        if (!window.ethereum || !walletAddress) return;

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(DRIVER_CONTRACT_ADDRESS, DriverContractABI, provider);
            const data = await contract.getDriverInfo(walletAddress);

            setDriverOnChain({
                insuranceDue: data.insuranceDue,
                roadTaxDue: data.roadTaxDue,
                roadworthy: data.roadworthy,
                safeDrivingScore: data.safeDrivingScore.toNumber(),
            });
        } catch (err) {
            console.error("On-chain fetch error:", err);
        }
    }, [walletAddress]);

    // Live update listener
    const setupLiveUpdate = useCallback(async () => {
        if (!window.ethereum || !walletAddress) return;

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(DRIVER_CONTRACT_ADDRESS, DriverContractABI, provider);

            contract.on("DriverStatusUpdated", (driverWallet, insuranceDue, roadTaxDue, roadworthy, safeDrivingScore) => {
                if (driverWallet.toLowerCase() === walletAddress.toLowerCase()) {
                    setDriverOnChain({
                        insuranceDue,
                        roadTaxDue,
                        roadworthy,
                        safeDrivingScore: safeDrivingScore.toNumber(),
                    });
                }
            });
        } catch (err) {
            console.error("Live update setup error:", err);
        }
    }, [walletAddress]);

    // Load backend profile and on-chain data
    useEffect(() => {
        if (profile) setForm(prev => ({ ...prev, ...profile }));
        fetchOnChainDriverData();
        setupLiveUpdate();
    }, [profile, fetchOnChainDriverData, setupLiveUpdate]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setSaved(false);
        setError("");
    }

    async function handleSave() {
        setLoading(true);
        setSaved(false);
        setError("");

        try {
            // Backend update
            const res = await fetch("/api/driver/profile/updatePersonalInfo", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Backend update failed");
            setProfile(prev => ({ ...prev, ...form }));

            // Smart contract update
            if (window.ethereum && walletAddress) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(DRIVER_CONTRACT_ADDRESS, DriverContractABI, signer);

                const tx = await contract.updateDriverInfo(
                    form.fullName,
                    form.licenseNumber,
                    form.vehiclePlate,
                    form.vehicleModel,
                    Number(form.vehicleYear)
                );
                await tx.wait();

                // Fetch updated on-chain data
                fetchOnChainDriverData();
            }

            setSaved(true);
        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong");
        }

        setLoading(false);
    }

    return (
        <div className="driver-profile-page p-lg">
            <h2 className="page-title">Driver Profile</h2>

            {/* Personal Info */}
            <div className="profile-card">
                <h3>Personal Information</h3>
                <div className="profile-grid">
                    {["fullName", "email", "phone", "address"].map((field) => (
                        <div key={field}>
                            <label>{field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</label>
                            <input
                                name={field}
                                value={form[field]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Driver / Vehicle Info */}
            <div className="profile-card">
                <h3>Driver & Vehicle Information</h3>
                <div className="profile-grid">
                    {["licenseNumber", "vehiclePlate", "vehicleModel", "vehicleYear", "vehicleType"].map(field => (
                        <div key={field}>
                            <label>{field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</label>
                            <input
                                name={field}
                                value={form[field]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Wallet Info */}
            <div className="profile-card">
                <h3>Wallet</h3>
                <div className="wallet-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <p className="small-txt">Connected Wallet</p>
                        <img src={copy_icon} alt="Copy Icon" className="copy-icon"
                            onClick={() => navigator.clipboard.writeText(walletAddress || "")} />
                    </div>
                    <input value={walletAddress || ""} disabled className="wallet-address-input" />
                    <ConnectWallet />
                </div>
            </div>

            {/* On-Chain Status Cards */}
            <div className="profile-card">
                <h3>On-Chain Vehicle Status</h3>
                <div className="status-grid">
                    <div className="status-card">
                        <p>Insurance Due</p>
                        <p>{driverOnChain.insuranceDue || "N/A"}</p>
                    </div>
                    <div className="status-card">
                        <p>Road Tax Due</p>
                        <p>{driverOnChain.roadTaxDue || "N/A"}</p>
                    </div>
                    <div className="status-card">
                        <p>Roadworthy</p>
                        <p>{driverOnChain.roadworthy ? "✅ Yes" : "❌ No"}</p>
                    </div>
                    <div className="status-card">
                        <p>Safe Driving Score</p>
                        <p>{driverOnChain.safeDrivingScore}/100</p>
                    </div>
                </div>
            </div>

            {/* Save Button & Feedback */}
            <div className="save-btn-container">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
                {saved && <span className="ml-md text-success">✔ Profile updated successfully</span>}
                {error && <span className="ml-md text-error">❌ {error}</span>}
            </div>
        </div>
    );
}
