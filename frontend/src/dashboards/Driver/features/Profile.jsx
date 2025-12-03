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

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch(`${API}/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setPersonal(data));
    }, [token]);

    const submitCar = async () => {
        const res = await fetch(`${API}/car`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ plateNumber }),
        });

        const data = await res.json();
        setCarData(data.data);
    };

    const submitNin = async () => {
        const res = await fetch(`${API}/nin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ nin }),
        });

        const data = await res.json();
        setNinData(data.data);
    };

    const acceptAgreement = async () => {
        const res = await fetch(`${API}/agreement`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.data) setAgreementAccepted(true);
    };

    return (
        <div className="profile-container">

            {/* 1️⃣ Personal Info */}
            <section className="card">
                <h2>Personal Information</h2>
                <p><strong>Name:</strong> {personal.name}</p>
                <p><strong>Email:</strong> {personal.email}</p>
            </section>

            {/* 2️⃣ Car Information */}
            <section className="card">
                <h2>Car Information</h2>
                <input
                    type="text"
                    placeholder="Enter Plate Number"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                />
                <button onClick={submitCar}>Fetch Car Info</button>

                {carData && (
                    <div className="result-box">
                        <p>Car Make: {carData.carMake}</p>
                        <p>Model: {carData.carModel}</p>
                        <p>Year: {carData.carYear}</p>
                    </div>
                )}
            </section>

            {/* 3️⃣ NIN */}
            <section className="card">
                <h2>NIN Verification</h2>
                <input
                    type="text"
                    placeholder="Enter NIN"
                    value={nin}
                    onChange={(e) => setNin(e.target.value)}
                />
                <button onClick={submitNin}>Fetch NIN Info</button>

                {ninData && (
                    <div className="result-box">
                        <p>Name: {ninData.ninData.firstname} {ninData.ninData.lastname}</p>
                        <p>Age: {ninData.ninData.age}</p>
                        <p>Gender: {ninData.ninData.gender}</p>
                    </div>
                )}
            </section>

            {/* 4️⃣ Agreement */}
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
