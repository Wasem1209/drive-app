import React, { useState, useEffect } from "react";
import "./Profile.css";
import PhoneFrame from "../../../components/PhoneFrame";

const API = "https://autofy-ys5x.onrender.com/api/profile";

/* =======================
   SUCCESS MODAL COMPONENT
==========================*/
const SuccessModal = ({ message, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3>Success 🎉</h3>
                <p>{message}</p>
                <button onClick={onClose}>Okay</button>
            </div>
        </div>
    );
};

const Profile = () => {
    const [personal, setPersonal] = useState({ name: "", email: "" });

    const [plateNumber, setPlateNumber] = useState("");
    const [chassis, setChassis] = useState("");
    const [engineNumber, setEngineNumber] = useState("");
    const [carModel, setCarModel] = useState("");
    const [carColor, setCarColor] = useState("");
    const [carYear, setCarYear] = useState("");

    const [carData, setCarData] = useState(null);

    const [nin, setNin] = useState("");
    const [ninData, setNinData] = useState(null);

    const [agreementAccepted, setAgreementAccepted] = useState(false);

    const [images, setImages] = useState({
        front: null,
        back: null,
        plate: null,
        engine: null,
        chassis: null,
    });

    const [preview, setPreview] = useState({});
    const [ipfsUrls, setIpfsUrls] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* Modal state */
    const [modalMessage, setModalMessage] = useState("");
    const token = localStorage.getItem("token");

    // Fetch personal info
    useEffect(() => {
        if (!token) return;
        setLoading(true);
        fetch(`${API}/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setPersonal(data))
            .catch(() => setError("Failed to load personal info"))
            .finally(() => setLoading(false));
    }, [token]);

    // Fetch Car Info
    const submitCar = async () => {
        if (!plateNumber) return setError("Please enter a plate number");
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API}/car`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ plateNumber }),
            });

            if (!res.ok) throw new Error("Failed to fetch car info");
            const data = await res.json();
            setCarData(data.data);
        } catch (err) {
            setError(err.message || "Unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    // NIN Verification
    const submitNin = async () => {
        if (!nin) return setError("Please enter your NIN");
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API}/nin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ nin }),
            });

            if (!res.ok) throw new Error("Failed to fetch NIN info");
            const data = await res.json();
            setNinData(data.data);
        } catch (err) {
            setError(err.message || "Unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Accept Agreement
    const acceptAgreement = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API}/agreement`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to accept agreement");
            const data = await res.json();
            if (data.data) setAgreementAccepted(true);
        } catch (err) {
            setError(err.message || "Unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Handle image selection
    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        setImages((prev) => ({ ...prev, [type]: file }));
        setPreview((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    };

    // Upload images → IPFS
    const uploadImagesToIPFS = async () => {
        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            Object.keys(images).forEach((key) => {
                if (images[key]) formData.append(key, images[key]);
            });

            const res = await fetch(`${API}/upload-images`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to upload images");
            const data = await res.json();
            setIpfsUrls(data.ipfs);

            setModalMessage("Vehicle images successfully uploaded to IPFS!");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ==========================
        NFT Mint Button (Frontend trigger only)
       ==========================*/
    const mintNFT = async () => {
        if (!ipfsUrls) {
            return setError("Upload vehicle images first");
        }

        setModalMessage("Your vehicle NFT will be minted on-chain soon ✔");
    };

    return (
        <PhoneFrame>
            <div className="profile-container">
                {loading && <div className="loading">Loading...</div>}
                {error && <div className="error">{error}</div>}

                {modalMessage && (
                    <SuccessModal
                        message={modalMessage}
                        onClose={() => setModalMessage("")}
                    />
                )}

                {/* PERSONAL INFO */}
                <section className="card">
                    <h2>Personal Information</h2>
                    <p><strong>Name:</strong> {personal.name}</p>
                    <p><strong>Email:</strong> {personal.email}</p>
                </section>

                {/* VEHICLE DETAILS */}
                <section className="card">
                    <h2>Vehicle Details</h2>

                    <input type="text" placeholder="Plate Number"
                        value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} />

                    <input type="text" placeholder="Chassis Number"
                        value={chassis} onChange={(e) => setChassis(e.target.value)} />

                    <input type="text" placeholder="Engine Number"
                        value={engineNumber} onChange={(e) => setEngineNumber(e.target.value)} />

                    <input type="text" placeholder="Car Model"
                        value={carModel} onChange={(e) => setCarModel(e.target.value)} />

                    <input type="text" placeholder="Car Color"
                        value={carColor} onChange={(e) => setCarColor(e.target.value)} />

                    <input type="text" placeholder="Manufacture Year"
                        value={carYear} onChange={(e) => setCarYear(e.target.value)} />

                    <button onClick={submitCar}>Fetch Car Info</button>

                    {carData && (
                        <div className="result-box">
                            <p>Car Make: {carData.carMake}</p>
                            <p>Model: {carData.carModel}</p>
                            <p>Year: {carData.carYear}</p>
                        </div>
                    )}
                </section>

                {/* UPLOAD VEHICLE IMAGES */}
                <section className="card">
                    <h2>Upload Vehicle Images</h2>

                    {["front", "back", "plate", "engine", "chassis"].map((type) => (
                        <div key={type} className="img-upload-row">
                            <label>{type.toUpperCase()} Image</label>
                            <input type="file" accept="image/*"
                                onChange={(e) => handleImageChange(e, type)} />

                            {preview[type] && (
                                <img src={preview[type]} alt={type} className="preview-img" />
                            )}
                        </div>
                    ))}

                    <button onClick={uploadImagesToIPFS}>
                        Upload Images to IPFS
                    </button>

                    {ipfsUrls && (
                        <div className="result-box">
                            <p>✔ Images uploaded to IPFS</p>
                        </div>
                    )}
                </section>

                {/* NIN Verification */}
                <section className="card">
                    <h2>NIN Verification</h2>
                    <input
                        type="text"
                        placeholder="Enter NIN"
                        value={nin}
                        onChange={(e) => setNin(e.target.value)}
                    />
                    <button onClick={submitNin}>Submit</button>

                    {ninData && (
                        <div className="result-box">
                            <p>Name: {ninData.firstname} {ninData.lastname}</p>
                            <p>Age: {ninData.age}</p>
                            <p>Gender: {ninData.gender}</p>
                        </div>
                    )}
                </section>

                {/* AGREEMENT */}
                <section className="card">
                    <h2>Driver Agreement</h2>
                    {!agreementAccepted ? (
                        <button className="agree-btn" onClick={acceptAgreement}>
                            Accept & Save
                        </button>
                    ) : (
                        <p className="success">✔ Agreement Accepted</p>
                    )}
                </section>

                {/* NFT Mint Button */}
                <section className="card">
                    <h2>Mint Vehicle NFT</h2>
                    <button onClick={mintNFT}>
                        Mint Vehicle Identity NFT
                    </button>
                </section>

            </div>
        </PhoneFrame>
    );
};

export default Profile;
