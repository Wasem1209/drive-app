import React, { useEffect, useState } from "react";
import "./Profile.css";

const Profile = () => {
    const [user, setUser] = useState({});
    const [plate, setPlate] = useState("");
    const [carInfo, setCarInfo] = useState(null);
    const [nin, setNin] = useState("");
    const [ninInfo, setNinInfo] = useState(null);
    const [accepted, setAccepted] = useState(false);

    // Fetch user info automatically
    useEffect(() => {
        const loadUser = async () => {
            const res = await fetch("/api/user/profile");
            const data = await res.json();
            setUser(data);
        };
        loadUser();
    }, []);

    // Fetch car info
    const fetchCarInfo = async () => {
        const res = await fetch("/api/car/lookup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plateNumber: plate }),
        });

        const data = await res.json();
        setCarInfo(data);
    };

    // Fetch NIN data
    const fetchNinInfo = async () => {
        const res = await fetch("/api/nin/lookup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nin }),
        });

        const data = await res.json();
        setNinInfo(data);
    };

    // Save Acceptance
    const saveAcceptance = async () => {
        const res = await fetch("/api/driver/accept-terms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, accepted: true }),
        });

        const data = await res.json();
        if (data.status === "success") {
            setAccepted(true);
        }
    };

    return (
        <div className="profile-container">

            {/* PERSONAL INFO */}
            <section className="profile-section">
                <h2>Personal Information</h2>
                <div className="info-box">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            </section>

            {/* CAR INFO */}
            <section className="profile-section">
                <h2>Car Information</h2>
                <input
                    type="text"
                    placeholder="Enter Plate Number"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    className="input-field"
                />
                <button onClick={fetchCarInfo} className="submit-btn">Get Car Info</button>

                {carInfo && (
                    <div className="info-box">
                        <p><strong>Make:</strong> {carInfo.make}</p>
                        <p><strong>Model:</strong> {carInfo.model}</p>
                        <p><strong>Year:</strong> {carInfo.year}</p>
                        <p><strong>Color:</strong> {carInfo.color}</p>
                    </div>
                )}
            </section>

            {/* NIN INFO */}
            <section className="profile-section">
                <h2>NIN Lookup</h2>
                <input
                    type="text"
                    placeholder="Enter NIN"
                    value={nin}
                    onChange={(e) => setNin(e.target.value)}
                    className="input-field"
                />
                <button onClick={fetchNinInfo} className="submit-btn">Fetch NIN Data</button>

                {ninInfo && (
                    <div className="info-box">
                        <p><strong>Name:</strong> {ninInfo.firstName} {ninInfo.lastName}</p>
                        <p><strong>DOB:</strong> {ninInfo.dob}</p>
                        <p><strong>Gender:</strong> {ninInfo.gender}</p>
                        <p><strong>Address:</strong> {ninInfo.address}</p>
                    </div>
                )}
            </section>

            {/* ACCEPT TERMS */}
            <section className="profile-section">
                <h2>Driver Agreement</h2>
                <label className="checkbox-row">
                    <input
                        type="checkbox"
                        checked={accepted}
                        onChange={() => { }}
                        disabled={accepted}
                    />
                    <span>I confirm that I have read and agree to the driver terms.</span>
                </label>

                {!accepted && (
                    <button onClick={saveAcceptance} className="submit-btn">
                        Accept & Save
                    </button>
                )}

                {accepted && <p className="success-text">✔ Saved Successfully</p>}
            </section>

        </div>
    );
};

export default Profile;
