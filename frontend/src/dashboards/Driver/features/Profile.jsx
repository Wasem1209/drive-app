// Profile.jsx — TEST MODE (no blockchain)
// Safe for Vite build, backend tests, and UI display.

import React, { useState, useEffect } from "react";
import '../../../styles/Profile.css';
import ConnectWallet from './ConnectWallet.jsx';

export default function Profile({ profile, setProfile }) {
    // Basic form state
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        licenseNumber: "",
        licenseExpiry: "",
        vehiclePlate: "",
        vehicleModel: "",
        vehicleYear: "",
        vehicleType: "",
    });

    // Documents placeholder
    // eslint-disable-next-line no-empty-pattern
    const [] = useState({
        licenseFile: null,
        insuranceFile: null,
        roadworthyFile: null,
        idFile: null,
    });

    // Fake KYC + On-chain Status
    const [, setKycStatus] = useState("not_submitted");
    const [driverOnChain, setDriverOnChain] = useState({
        insuranceDue: "2025-12-01",
        roadTaxDue: "2025-12-01",
        roadworthy: false,
        safeDrivingScore: 80,
        verifiedOnChain: false,
    });

    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    // Load backend profile if provided
    useEffect(() => {
        if (profile) {
            setForm(prev => ({ ...prev, ...profile }));
            if (profile.kycStatus) setKycStatus(profile.kycStatus);
        }
    }, [profile]);

    // Format date safely
    const formatDate = (d) => {
        if (!d) return "N/A";
        try { return new Date(d).toLocaleDateString(); }
        catch { return d; }
    };

    // Form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Fake file handler

    // ---- PLACEHOLDER: Save profile (Backend only) ----
    const handleSave = async () => {
        setLoading(true);
        setError("");

        try {
            // Upload docs ONLY to backend (placeholder)
            const res = await fetch("/api/driver/profile/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Backend update failed");

            setProfile(prev => ({ ...prev, ...form }));
            setSaved(true);

        } catch (err) {
            setError(err.message || "Save failed");
        } finally {
            setLoading(false);
        }
    };

    // ---- PLACEHOLDER: Pay Insurance (Fake on-chain) ----
    const onPayInsurance = async () => {
        setLoading(true);

        // Simulate a 2-second blockchain action
        setTimeout(() => {
            setDriverOnChain(prev => ({
                ...prev,
                insuranceDue: "2026-01-01",
                verifiedOnChain: true,
            }));
            setLoading(false);
        }, 2000);
    };


    return (
        <div className="driver-profile-page profile-hybrid">
            {/* KEEP your JSX here exactly as before */}
            {/* The only thing replaced is the logic above */}

            <h2>Driver Profile (Test Mode)</h2>

            {/* Example: */}
            <div>
                <label>Full Name</label>
                <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                />
            </div>

            <button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
            </button>

            <button onClick={onPayInsurance} disabled={loading}>
                {loading ? "Processing..." : "Pay Insurance (TEST)"}
            </button>

            {saved && <p style={{ color: "green" }}>Saved successfully!</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ marginTop: "20px" }}>
                <p><strong>Insurance Due:</strong> {formatDate(driverOnChain.insuranceDue)}</p>
                <p><strong>Safe Driving Score:</strong> {driverOnChain.safeDrivingScore}</p>
                <p><strong>Verified On-Chain:</strong> {driverOnChain.verifiedOnChain ? "Yes" : "No"}</p>
            </div>
        </div>
    );
}
