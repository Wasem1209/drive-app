// src/pages/driver/Profile.jsx
import React, { useState, useEffect } from "react";
import "./Profile.css";
import PhoneFrame from "../../../components/PhoneFrame";

const API = "https://autofy-ys5x.onrender.com/api/profile";

const SuccessModal = ({ title, message, onClose, link }) => (
    <div className="modal-overlay">
        <div className="modal-box">
            <h3>{title}</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{message}</p>
            {link && (
                <p style={{ marginTop: 8 }}>
                    View on explorer:{" "}
                    <a href={link} target="_blank" rel="noreferrer">
                        Open tx
                    </a>
                </p>
            )}
            <button onClick={onClose}>Okay</button>
        </div>
    </div>
);

const Profile = () => {
    // Driver personal
    const [personal, setPersonal] = useState({ name: "", email: "" });

    // Vehicle
    const [plateNumber, setPlateNumber] = useState("");
    const [chassis, setChassis] = useState("");
    const [engineNumber, setEngineNumber] = useState("");
    const [carModel, setCarModel] = useState("");
    const [carColor, setCarColor] = useState("");
    const [carYear, setCarYear] = useState("");

    // images + preview
    const [images, setImages] = useState({
        front: null,
        back: null,
        plate: null,
        engine: null,
        chassis: null,
    });
    const [preview, setPreview] = useState({});

    // ipfs urls returned from backend
    const [ipfsUrls, setIpfsUrls] = useState(null);

    // optional fetched car details (if you use an external lookup)
    const [carData, setCarData] = useState(null);

    // NIN (mock)
    const [nin, setNin] = useState("");
    const [ninData, setNinData] = useState(null);

    // agreement
    const [agreementAccepted, setAgreementAccepted] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // success modal
    const [success, setSuccess] = useState({ open: false, title: "", message: "", link: "" });

    const token = localStorage.getItem("token");

    useEffect(() => {
        // If you want to prefill personal from backend:
        const fetchMe = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const res = await fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } });
                if (!res.ok) throw new Error("Failed to fetch profile");
                const data = await res.json();
                if (data) setPersonal({ name: data.name || "", email: data.email || "" });
            } catch (err) {
                console.warn("Profile fetch", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMe();
    }, [token]);

    // image select & preview
    const handleImageChange = (e, type) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        setImages((p) => ({ ...p, [type]: file }));
        setPreview((p) => ({ ...p, [type]: URL.createObjectURL(file) }));
    };

    // upload images to backend which returns IPFS links
    const uploadImagesToIPFS = async () => {
        setError("");
        setLoading(true);
        try {
            const fd = new FormData();
            Object.keys(images).forEach((k) => {
                if (images[k]) fd.append(k, images[k]);
            });

            const res = await fetch(`${API}/upload-images`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Upload failed");
            }
            const data = await res.json();
            // backend returns { ipfs: { front: 'ipfs://..', ... } }
            setIpfsUrls(data.ipfs);
            setSuccess({ open: true, title: "Images uploaded", message: "Vehicle images uploaded to IPFS.", link: "" });
        } catch (err) {
            setError(err.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    // mock NIN verification (we'll pretend any input maps to a person)
    const submitNin = async () => {
        setError("");
        if (!nin) return setError("Please enter NIN (mock)");
        // mock: produce some fake data to display
        setNinData({
            firstname: personal.name || "John",
            lastname: personal.name ? "" : "Doe",
            age: 32,
            gender: "M",
            nin,
        });
    };

    // optional fetch car info (existing)
    const submitCar = async () => {
        setError("");
        if (!plateNumber) return setError("Enter plate number first");
        setLoading(true);
        try {
            const res = await fetch(`${API}/car`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ plateNumber }),
            });
            if (!res.ok) {
                // maybe server returns not found; ignore for hackathon
                const txt = await res.text();
                throw new Error(txt || "Car lookup failed");
            }
            const data = await res.json();
            setCarData(data.data || null);
        } catch (err) {
            // for hackathon we can ignore — show message
            setError(err.message || "Car lookup failed");
        } finally {
            setLoading(false);
        }
    };

    // register driver record (optional - stores on your backend DB)
    const registerDriverOnBackend = async () => {
        setLoading(true);
        setError("");
        try {
            const payload = {
                personal,
                ninData,
            };
            const res = await fetch(`${API}/register-driver`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Failed to register driver");
            }
            const data = await res.json();
            return data;
        } catch (err) {
            setError(err.message || "Register driver failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // final mint: ask backend to mint driver & vehicle NFT
    const mintVehicle = async () => {
        setError("");
        if (!agreementAccepted) return setError("Please accept the driver agreement first.");
        if (!ipfsUrls) return setError("Upload vehicle images first.");
        if (!ninData) return setError("Please verify NIN (mock) first.");

        setLoading(true);
        try {
            // (optional) register driver in backend DB
            await registerDriverOnBackend().catch(() => {
                // non-fatal — continue
            });

            const body = {
                personal,
                ninData,
                vehicle: {
                    plateNumber,
                    chassis,
                    engineNumber,
                    carModel,
                    carColor,
                    carYear,
                },
                ipfs: ipfsUrls,
            };

            const res = await fetch(`${API}/mint-nft`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Minting failed");
            }

            const data = await res.json();
            // backend returns { ok: true, txHash, policyId, driverAssetId, vehicleAssetId }
            const tx = data.txHash;
            const driverAsset = data.driverAsset || null;
            const vehicleAsset = data.vehicleAsset || null;

            const explorerBase = (data.network || "mainnet") === "mainnet"
                ? "https://cardanoscan.io/transaction/"
                : "https://preprod.cardanoscan.io/transaction/";

            setSuccess({
                open: true,
                title: "Mint Successful",
                message: `Driver NFT: ${driverAsset || "n/a"}\nVehicle NFT: ${vehicleAsset || "n/a"}\n\nTx: ${tx}`,
                link: explorerBase + tx,
            });
        } catch (err) {
            setError(err.message || "Mint failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PhoneFrame>
            <div className="profile-container">
                {loading && <div className="loading">Loading...</div>}
                {error && <div className="error">{error}</div>}

                {success.open && (
                    <SuccessModal
                        title={success.title}
                        message={success.message}
                        link={success.link}
                        onClose={() => setSuccess({ open: false, title: "", message: "", link: "" })}
                    />
                )}

                {/* PERSONAL INFO */}
                <section className="card">
                    <h2>Personal Information</h2>
                    <input
                        placeholder="Full Name"
                        value={personal.name}
                        onChange={(e) => setPersonal((p) => ({ ...p, name: e.target.value }))}
                    />
                    <input
                        placeholder="Email"
                        value={personal.email}
                        onChange={(e) => setPersonal((p) => ({ ...p, email: e.target.value }))}
                    />
                </section>

                {/* VEHICLE DETAILS */}
                <section className="card">
                    <h2>Vehicle Details</h2>
                    <input placeholder="Plate Number" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} />
                    <input placeholder="Chassis Number" value={chassis} onChange={(e) => setChassis(e.target.value)} />
                    <input placeholder="Engine Number" value={engineNumber} onChange={(e) => setEngineNumber(e.target.value)} />
                    <input placeholder="Car Model" value={carModel} onChange={(e) => setCarModel(e.target.value)} />
                    <input placeholder="Car Color" value={carColor} onChange={(e) => setCarColor(e.target.value)} />
                    <input placeholder="Manufacture Year" value={carYear} onChange={(e) => setCarYear(e.target.value)} />

                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button onClick={submitCar}>Fetch Car Info</button>
                        <button onClick={() => { setPlateNumber(""); setChassis(""); setEngineNumber(""); setCarModel(""); setCarColor(""); setCarYear(""); }}>
                            Clear
                        </button>
                    </div>

                    {carData && (
                        <div className="result-box">
                            <p>Car Make: {carData.carMake}</p>
                            <p>Model: {carData.carModel}</p>
                            <p>Year: {carData.carYear}</p>
                        </div>
                    )}
                </section>

                {/* IMAGE UPLOAD */}
                <section className="card">
                    <h2>Upload Vehicle Images</h2>
                    {["front", "back", "plate", "engine", "chassis"].map((type) => (
                        <div key={type} className="img-upload-row">
                            <label style={{ textTransform: "uppercase" }}>{type}</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, type)} />
                            {preview[type] && <img src={preview[type]} alt={type} className="preview-img" />}
                        </div>
                    ))}

                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button onClick={uploadImagesToIPFS}>Upload Images to IPFS</button>
                        <button
                            onClick={() => {
                                setImages({ front: null, back: null, plate: null, engine: null, chassis: null });
                                setPreview({});
                                setIpfsUrls(null);
                            }}
                        >
                            Reset Images
                        </button>
                    </div>

                    {ipfsUrls && (
                        <div className="result-box">
                            <p>✔ Images uploaded to IPFS</p>
                        </div>
                    )}
                </section>

                {/* NIN (mock) */}
                <section className="card">
                    <h2>NIN (mock)</h2>
                    <input placeholder="NIN (mock)" value={nin} onChange={(e) => setNin(e.target.value)} />
                    <button onClick={submitNin}>Verify NIN (mock)</button>

                    {ninData && (
                        <div className="result-box">
                            <p>
                                Name: {ninData.firstname} {ninData.lastname}
                            </p>
                            <p>Age: {ninData.age}</p>
                            <p>Gender: {ninData.gender}</p>
                        </div>
                    )}
                </section>

                {/* Agreement */}
                <section className="card">
                    <h2>Driver Agreement</h2>
                    {!agreementAccepted ? (
                        <button className="agree-btn" onClick={() => setAgreementAccepted(true)}>
                            Accept & Save
                        </button>
                    ) : (
                        <p className="success">✔ Agreement Accepted</p>
                    )}
                </section>

                {/* MINT */}
                <section className="card">
                    <h2>Mint Vehicle Identity</h2>
                    <p style={{ marginTop: 0, opacity: 0.8 }}>
                        This will mint two NFTs: one for the driver (driver identity) and one for the vehicle (vehicle identity).
                        Metadata and images are stored on IPFS.
                    </p>

                    <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={mintVehicle}>Mint on Cardano</button>
                        <button
                            onClick={() => {
                                setIpfsUrls(null);
                                setSuccess({ open: false, title: "", message: "", link: "" });
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </section>
            </div>
        </PhoneFrame>
    );
};

export default Profile;
