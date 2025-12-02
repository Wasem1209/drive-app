// Profile.jsx (hybrid structure)
// Main glue component that imports subcomponents and holds shared state
import React, { useState, useEffect, useCallback } from "react";
import "../../../styles/Profile.css";
import IdentitySection from "./components/IdentitySection";
import ComplianceSection from "./components/ComplianceSection";
import OnchainActions from "./components/OnchainActions";
import ConnectWallet from "./ConnectWallet.jsx";

export default function Profile({ profileProp, setProfileProp, walletAddress }) {
    // profileProp comes from backend (user object)
    const [profile, setProfile] = useState(profileProp || {});
    const [onChainState, setOnChainState] = useState({
        insuranceDue: null,
        roadTaxDue: null,
        roadworthy: false,
        safeDrivingScore: 0,
        verifiedOnChain: false,
        vehicleNft: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // load server-side profile (optional)
    const fetchProfile = useCallback(async () => {
        try {
            const res = await fetch("/api/driver/profile");
            if (!res.ok) throw new Error("Failed to load profile");
            const json = await res.json();
            setProfile(json);
        } catch (e) {
            console.warn("fetchProfile:", e.message);
        }
    }, []);

    useEffect(() => { fetchProfile(); }, [fetchProfile]);

    // Callback to update profile in parent or local state
    const handleProfileUpdate = (newProfile) => {
        setProfile(prev => ({ ...prev, ...newProfile }));
        if (setProfileProp) setProfileProp(prev => ({ ...prev, ...newProfile }));
    };

    return (
        <div className="driver-profile-page">
            <div className="profile-topbar">
                <h1>Driver Profile</h1>
                <div className="wallet-connect">
                    <ConnectWallet />
                </div>
            </div>

            <div className="profile-grid">
                <div className="left">
                    <IdentitySection
                        profile={profile}
                        onSave={handleProfileUpdate}
                        setError={setError}
                        setLoading={setLoading}
                    />
                </div>

                <div className="right">
                    <ComplianceSection
                        profile={profile}
                        onChainState={onChainState}
                        setOnChainState={setOnChainState}
                    />

                    <OnchainActions
                        walletAddress={walletAddress}
                        profile={profile}
                        onChainState={onChainState}
                        setOnChainState={setOnChainState}
                        setError={setError}
                        setLoading={setLoading}
                        onSavedProfile={handleProfileUpdate}
                    />
                </div>
            </div>

            {loading && <div className="overlay">Processing...</div>}
            {error && <div className="error-banner">{error}</div>}
        </div>
    );
}
