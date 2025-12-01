// Profile.jsx (Cardano-ready: Nami + Lucid primary, polling-based live updates, Aiken placeholders)
import React, { useState, useEffect, useCallback, useRef } from "react";
import '../../../styles/Profile.css';
import ConnectWallet from './ConnectWallet.jsx';
import copy_icon from '../../../assets/Copy.png';

// Lucid + Mesh helpers
import { Lucid, Blockfrost, Utils } from "lucid-cardano";

// ---------- CONFIG / PLACEHOLDERS (YOU MUST FILL THESE) ----------
const BLOCKFROST_PROJECT_ID = "YOUR_BLOCKFROST_PROJECT_ID"; // ← set this
const NETWORK = "Mainnet"; // or "Testnet"
const AIKEN_SCRIPT_ADDRESS = "addr_test1..."; // <-- put your Aiken script address here (or contract address)
const AIKEN_SCRIPT_UTXO = "txHash#index"; // <-- reference UTxO for spending the script (if used)
const POLL_INTERVAL_MS = 10_000; // 10s polling for "live updates"
// -----------------------------------------------------------------

export default function Profile({ profile, setProfile, walletAddress }) {
    // local state
    const [lucid, setLucid] = useState(null);
    const [, setConnected] = useState(false);

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

    const [docs, setDocs] = useState({
        licenseFile: null,
        insuranceFile: null,
        roadworthyFile: null,
        idFile: null,
    });

    const [kycStatus, setKycStatus] = useState("not_submitted"); // not_submitted | pending | verified | rejected

    const [driverOnChain, setDriverOnChain] = useState({
        insuranceDue: null,
        roadTaxDue: null,
        roadworthy: false,
        safeDrivingScore: 0,
        verifiedOnChain: false,
    });

    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [pulseMs, setPulseMs] = useState(null);

    const pollRef = useRef(null);

    // -------------- Lucid + Nami init --------------
    const initLucid = useCallback(async () => {
        try {
            if (!window.cardano || !window.cardano.nami) {
                console.warn("Nami wallet not detected.");
                return;
            }

            // prompt enable if not already
            await window.cardano.nami.enable();

            // create Lucid instance
            const lucidInstance = await Lucid.new(
                new Blockfrost(BLOCKFROST_PROJECT_ID, NETWORK === "Mainnet" ? "https://cardano-mainnet.blockfrost.io/api/v0" : "https://cardano-testnet.blockfrost.io/api/v0"),
                NETWORK === "Mainnet" ? "Mainnet" : "Testnet"
            );

            // connect lucid to wallet
            lucidInstance.selectWallet(window.cardano.nami);
            setLucid(lucidInstance);
            setConnected(true);
        } catch (err) {
            console.error("initLucid:", err);
            setConnected(false);
        }
    }, []);

    // call initLucid once if walletAddress present
    useEffect(() => {
        if (walletAddress) initLucid();
    }, [walletAddress, initLucid]);

    // -------------- load backend profile into form --------------
    useEffect(() => {
        if (profile) {
            setForm(prev => ({ ...prev, ...profile }));
            if (profile.kycStatus) setKycStatus(profile.kycStatus);
            if (profile.documents) setDocs(prev => ({ ...prev, ...profile.documents }));
        }
    }, [profile]);

    // ---------- Helper: formatDate ----------
    const formatDate = (iso) => {
        if (!iso) return "N/A";
        try {
            return new Date(iso).toLocaleDateString();
        } catch { return iso; }
    };

    // ---------- On-chain reading (Lucid) ----------
    const readDriverOnChain = useCallback(async () => {
        if (!lucid || !walletAddress) return;

        try {
            // NOTE:
            // Cardano/Aiken data patterns often store datums at a script address or in a UTxO minted with a policy.
            // Here we attempt to read the script UTxOs at AIKEN_SCRIPT_ADDRESS and find a datum keyed by walletAddress.
            // Adjust this code to match your Aiken validator/datum shape after you compile your Aiken contract.

            // 1) get all UTxOs at the script address
            const utxos = await lucid.utxosAt(AIKEN_SCRIPT_ADDRESS);

            // 2) find datum for the driver (this depends on how you store datums)
            // Example assumption: each UTxO contains a datum with { owner: walletAddress, insuranceDue, roadTaxDue, roadworthy, safeDrivingScore, verified }
            for (const utxo of utxos) {
                if (!utxo.datum) continue;
                const datum = utxo.datum; // lucid exposes parsed datum if available
                // robust check: compare owner address or hex wallet id - adjust based on your datum
                if (datum.owner && datum.owner.toLowerCase() === walletAddress.toLowerCase()) {
                    setDriverOnChain({
                        insuranceDue: datum.insuranceDue || null,
                        roadTaxDue: datum.roadTaxDue || null,
                        roadworthy: !!datum.roadworthy,
                        safeDrivingScore: datum.safeDrivingScore || 0,
                        verifiedOnChain: !!datum.verified,
                    });
                    return; // found driver datum
                }
            }

            // fallback: no datum found for this driver
            setDriverOnChain(prev => ({ ...prev, verifiedOnChain: false }));
        } catch (err) {
            console.warn("readDriverOnChain:", err);
        }
    }, [lucid, walletAddress]);

    // ---------- Polling setup for "live update" (Cardano has no events) ----------
    const startPolling = useCallback(() => {
        // clear existing
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = setInterval(async () => {
            const prev = JSON.stringify(driverOnChain);
            await readDriverOnChain();
            const next = JSON.stringify(driverOnChain);
            // if changed, trigger pulse (we'll set pulseMs which toggles CSS)
            if (prev !== next) {
                setPulseMs(Date.now());
                setTimeout(() => setPulseMs(null), 1400);
            }
        }, POLL_INTERVAL_MS);
    }, [readDriverOnChain, driverOnChain]);

    const stopPolling = useCallback(() => {
        if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
        }
    }, []);

    // attach polling once lucid/wallet ready
    useEffect(() => {
        if (lucid && walletAddress) {
            // initial read
            (async () => { await readDriverOnChain(); })();
            startPolling();
        }
        return () => stopPolling();
    }, [lucid, walletAddress, readDriverOnChain, startPolling, stopPolling]);

    // ---------- UI handlers ----------
    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setSaved(false);
        setError("");
    }

    function handleFileChange(e, key) {
        const file = e.target.files?.[0] || null;
        setDocs(prev => ({ ...prev, [key]: file }));
    }

    // ---------- Upload documents to backend ----------
    async function uploadDocuments() {
        const changedFiles = Object.entries(docs).filter(([, v]) => v instanceof File);
        if (changedFiles.length === 0) return null;

        const fd = new FormData();
        changedFiles.forEach(([k, file]) => fd.append(k, file));

        const res = await fetch("/api/driver/profile/uploadDocuments", { method: "POST", body: fd });
        if (!res.ok) {
            const d = await res.json().catch(() => ({}));
            throw new Error(d.message || "Document upload failed");
        }
        return await res.json();
    }

    // ---------- On-chain write helpers (Lucid + Aiken pattern placeholder) ----------
    // Important: When you compile your Aiken validator, you'll need to replace the SCRIPT datum structure below.
    async function saveProfileOnChain() {
        if (!lucid || !walletAddress) throw new Error("Wallet not connected");

        // Example: create a tx that pays a datum to the script address that stores driver info.
        // This is a generic pattern: payToContract(scriptAddress, datum, assets)
        // Replace 'datum' structure with your Aiken schema when available.
        const datum = {
            owner: walletAddress,
            fullName: form.fullName,
            licenseNumber: form.licenseNumber,
            vehiclePlate: form.vehiclePlate,
            vehicleModel: form.vehicleModel,
            vehicleYear: form.vehicleYear ? Number(form.vehicleYear) : null,
            updatedAt: new Date().toISOString(),
            // other fields as needed...
        };

        // convert JS datum to cbor via Lucid Utils if needed
        try {
            // Set a small ada amount to attach to the datum (minUTxO)
            const minLovelace = 2_000_000n;

            const tx = await lucid.newTx()
                .payToContract(AIKEN_SCRIPT_ADDRESS, { inline: datum }, { lovelace: minLovelace })
                .complete();

            const signed = await tx.sign().complete();
            const txHash = await signed.submit();
            return txHash;
        } catch (err) {
            console.error("saveProfileOnChain:", err);
            throw err;
        }
    }

    // Example: payInsuranceOnChain (you will adapt to your Aiken validator call)
    async function payInsuranceOnChain(amountLovelace = 5_000_000n) {
        if (!lucid || !walletAddress) throw new Error("Wallet not connected");

        // Placeholder: send ADA to script address with a small datum indicating payment
        const datum = {
            owner: walletAddress,
            action: "payInsurance",
            amount: amountLovelace.toString(),
            timestamp: new Date().toISOString(),
        };

        try {
            const tx = await lucid.newTx()
                .payToContract(AIKEN_SCRIPT_ADDRESS, { inline: datum }, { lovelace: BigInt(amountLovelace) })
                .complete();

            const signed = await tx.sign().complete();
            const txHash = await signed.submit();
            return txHash;
        } catch (err) {
            console.error("payInsuranceOnChain:", err);
            throw err;
        }
    }

    // ---------- Save handler (upload docs -> update backend -> optionally call chain) ----------
    async function handleSave() {
        setLoading(true);
        setSaved(false);
        setError("");

        try {
            await uploadDocuments();

            // update backend profile (MongoDB)
            const res = await fetch("/api/driver/profile/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Backend update failed");

            setProfile(prev => ({ ...prev, ...form }));

            // optional on-chain save (only if you want to store summary on-chain)
            if (lucid && walletAddress) {
                await saveProfileOnChain();
                // refresh local on-chain read
                await readDriverOnChain();
                setPulseMs(Date.now());
                setTimeout(() => setPulseMs(null), 1400);
            }

            setSaved(true);
        } catch (err) {
            console.error(err);
            setError(err.message || "Save failed");
        } finally {
            setLoading(false);
        }
    }

    // ---------- Quick action: pay insurance (demo) ----------
    async function onPayInsurance() {
        try {
            setLoading(true);
            const txHash = await payInsuranceOnChain(5_000_000n);
            // poll for new on-chain state after tx
            await new Promise(r => setTimeout(r, 3000));
            await readDriverOnChain();
            setPulseMs(Date.now());
            setTimeout(() => setPulseMs(null), 1400);
            return txHash;
        } catch (err) {
            console.error(err);
            setError(err.message || "Pay failed");
        } finally {
            setLoading(false);
        }
    }

    // ---------- helper: copy wallet ----------
    function copyWallet() {
        if (!walletAddress) return;
        navigator.clipboard.writeText(walletAddress);
    }

    // ---------- render ----------
    return (
        <div className="driver-profile-page profile-hybrid">
            {/* HEADER */}
            <div className="profile-header">
                <div className="profile-avatar">
                    <div className="avatar-circle">{(form.fullName || "D").charAt(0).toUpperCase()}</div>
                </div>

                <div className="profile-main">
                    <h1 className="profile-name">{form.fullName || "Unnamed Driver"}</h1>
                    <div className="profile-meta">
                        <span className="badge role">Driver</span>
                        <span className={`badge ${driverOnChain.verifiedOnChain ? "verified" : "pending"}`}>
                            {driverOnChain.verifiedOnChain ? "Verified (on-chain)" : "Unverified"}
                        </span>
                    </div>

                    <div className="wallet-row">
                        <div className="wallet-left">
                            <p className="small-label">Wallet</p>
                            <div className="wallet-address-box">
                                <span className="addr-short">{walletAddress ? `${walletAddress.substring(0, 8)}...${walletAddress.slice(-6)}` : "Not connected"}</span>
                                <img src={copy_icon} alt="copy" className="copy-icon" onClick={copyWallet} />
                            </div>
                        </div>
                        <div className="wallet-actions">
                            <ConnectWallet />
                        </div>
                    </div>
                </div>

                <div className="status-column">
                    <div className={`status-pill ${pulseMs ? "pulse" : ""}`}>
                        <div className="score-label">Safe Score</div>
                        <div className="score-value">{driverOnChain.safeDrivingScore}/100</div>
                    </div>
                </div>
            </div>

            {/* GRID: left - forms, right - on-chain & docs */}
            <div className="profile-grid-wrap">
                <div className="left-col">
                    {/* Personal card */}
                    <section className="profile-card">
                        <h3>Personal Information</h3>
                        <div className="profile-grid">
                            <div>
                                <label>Full Name</label>
                                <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter full name" />
                            </div>
                            <div>
                                <label>Email</label>
                                <input name="email" value={form.email} onChange={handleChange} placeholder="Enter email" />
                            </div>
                            <div>
                                <label>Phone</label>
                                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Enter phone number" />
                            </div>
                            <div>
                                <label>Home Address</label>
                                <input name="address" value={form.address} onChange={handleChange} placeholder="Enter address" />
                            </div>
                        </div>
                    </section>

                    {/* Driver & Vehicle */}
                    <section className="profile-card">
                        <h3>Driver & Vehicle</h3>
                        <div className="profile-grid">
                            <div>
                                <label>License Number</label>
                                <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} placeholder="License number" />
                            </div>
                            <div>
                                <label>License Expiry</label>
                                <input type="date" name="licenseExpiry" value={form.licenseExpiry} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Vehicle Plate</label>
                                <input name="vehiclePlate" value={form.vehiclePlate} onChange={handleChange} placeholder="Plate e.g. ABC-123-XY" />
                            </div>
                            <div>
                                <label>Vehicle Model</label>
                                <input name="vehicleModel" value={form.vehicleModel} onChange={handleChange} placeholder="Model" />
                            </div>
                            <div>
                                <label>Vehicle Year</label>
                                <input name="vehicleYear" value={form.vehicleYear} onChange={handleChange} placeholder="Year" />
                            </div>
                            <div>
                                <label>Vehicle Type</label>
                                <input name="vehicleType" value={form.vehicleType} onChange={handleChange} placeholder="Car, Bus, Truck..." />
                            </div>
                        </div>
                    </section>

                    {/* KYC + Documents */}
                    <section className="profile-card">
                        <h3>KYC & Documents</h3>
                        <div className="docs-grid">
                            <div className="doc-item">
                                <label>Driver's License</label>
                                <div className="doc-row">
                                    <input type="file" onChange={(e) => handleFileChange(e, "licenseFile")} />
                                    {docs.licenseFile && <span className="doc-name">{docs.licenseFile.name}</span>}
                                </div>
                            </div>

                            <div className="doc-item">
                                <label>Vehicle Insurance</label>
                                <div className="doc-row">
                                    <input type="file" onChange={(e) => handleFileChange(e, "insuranceFile")} />
                                    {docs.insuranceFile && <span className="doc-name">{docs.insuranceFile.name}</span>}
                                </div>
                            </div>

                            <div className="doc-item">
                                <label>Roadworthy Cert</label>
                                <div className="doc-row">
                                    <input type="file" onChange={(e) => handleFileChange(e, "roadworthyFile")} />
                                    {docs.roadworthyFile && <span className="doc-name">{docs.roadworthyFile.name}</span>}
                                </div>
                            </div>

                            <div className="doc-item">
                                <label>Government ID (NIN)</label>
                                <div className="doc-row">
                                    <input type="file" onChange={(e) => handleFileChange(e, "idFile")} />
                                    {docs.idFile && <span className="doc-name">{docs.idFile.name}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="kyc-row">
                            <span className={`kyc-status ${kycStatus}`}>{kycStatus.replace("_", " ").toUpperCase()}</span>
                            <button className="small-btn" onClick={async () => {
                                // submit KYC placeholder
                                try {
                                    setLoading(true);
                                    const r = await fetch("/api/driver/profile/submitKyc", { method: "POST", body: JSON.stringify({ wallet: walletAddress }), headers: { "Content-Type": "application/json" } });
                                    const j = await r.json();
                                    if (!r.ok) throw new Error(j.message || "KYC submit failed");
                                    setKycStatus("pending");
                                } catch (e) {
                                    setError(e.message || "KYC submit failed");
                                } finally {
                                    setLoading(false);
                                }
                            }}>Submit KYC</button>
                        </div>
                    </section>

                    {/* save */}
                    <div className="save-btn-container">
                        <button className="btn-primary" disabled={loading} onClick={handleSave}>
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                        {saved && <span className="text-success">✔ Saved</span>}
                        {error && <span className="text-error">❌ {error}</span>}
                    </div>
                </div>

                <aside className="right-col">
                    {/* On-chain status panel */}
                    <div className="profile-card status-panel">
                        <h3>On-Chain Status</h3>
                        <div className="status-grid">
                            <div className={`status-card ${pulseMs ? "highlight" : ""}`}>
                                <p>Insurance Due</p>
                                <p>{driverOnChain.insuranceDue ? formatDate(driverOnChain.insuranceDue) : "N/A"}</p>
                            </div>
                            <div className={`status-card ${pulseMs ? "highlight" : ""}`}>
                                <p>Road Tax Due</p>
                                <p>{driverOnChain.roadTaxDue ? formatDate(driverOnChain.roadTaxDue) : "N/A"}</p>
                            </div>
                            <div className={`status-card ${pulseMs ? "highlight" : ""}`}>
                                <p>Roadworthy</p>
                                <p>{driverOnChain.roadworthy ? "✅" : "❌"}</p>
                            </div>
                            <div className={`status-card ${pulseMs ? "highlight" : ""}`}>
                                <p>Verified</p>
                                <p>{driverOnChain.verifiedOnChain ? "Yes" : "No"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="profile-card actions-panel">
                        <h3>Quick Actions</h3>
                        <div className="actions-grid">
                            <button className="action-btn" onClick={async () => { await onPayInsurance(); }}>Pay Insurance</button>
                            <button className="action-btn" onClick={async () => { /* TODO: implement payRoadTaxOnChain */ }}>Pay Road Tax</button>
                            <button className="action-btn" onClick={() => { /* TODO: view infractions */ }}>View Infractions</button>
                        </div>
                    </div>

                    {/* Documents viewer (backend links) */}
                    <div className="profile-card docs-panel">
                        <h3>Uploaded Docs</h3>
                        <ul className="doc-list">
                            <li>{docs.licenseFile ? docs.licenseFile.name : "Driver's License - Not uploaded"}</li>
                            <li>{docs.insuranceFile ? docs.insuranceFile.name : "Vehicle Insurance - Not uploaded"}</li>
                            <li>{docs.roadworthyFile ? docs.roadworthyFile.name : "Roadworthy - Not uploaded"}</li>
                            <li>{docs.idFile ? docs.idFile.name : "NIN/ID - Not uploaded"}</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
