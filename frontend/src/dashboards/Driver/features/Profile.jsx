import React, { useState, useEffect } from "react";
import "./Profile.css";

const API = "https://autofy-ys5x.onrender.com/api/profile";

const Profile = () => {
    const [personal, setPersonal] = useState({ name: "", email: "" });
    const [plateNumber, setPlateNumber] = useState("");
    const [carData, setCarData] = useState(null);
    const [nin, setNin] = useState("");
    const [ninData, setNinData] = useState(null);
    const [agreementAccepted, setAgreementAccepted] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    // Fetch NIN Info
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

    return (
        <div className="profile-container">
            {loading && <div className="loading">⏳ Loading...</div>}
            {error && <div className="error">{error}</div>}

            {/* Personal Info */}
            <section className="card">
                <h2>Personal Information</h2>
                <p>
                    <strong>Name:</strong> {personal.name}
                </p>
                <p>
                    <strong>Email:</strong> {personal.email}
                </p>
            </section>

            {/* Car Information */}
            <section className="card">
                <h2>Car Information</h2>
                <input
                    type="text"
                    placeholder="Enter Plate Number"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                />
                <button onClick={submitCar}>Submit</button>

                {carData && (
                    <div className="result-box">
                        <p>Car Make: {carData.carMake}</p>
                        <p>Model: {carData.carModel}</p>
                        <p>Year: {carData.carYear}</p>
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
                        <p>
                            Name: {ninData.firstname} {ninData.lastname}
                        </p>
                        <p>Age: {ninData.age}</p>
                        <p>Gender: {ninData.gender}</p>
                    </div>
                )}
            </section>

            {/* Driver Agreement */}
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
        </div>
    );
};

export default Profile;
