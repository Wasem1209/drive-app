import React, { useState } from "react";
import {
    FaShieldAlt,
    FaUserSecret,
    FaCarSide,
    FaUsers,
    FaExclamationTriangle,
    FaUserPlus,
    FaArrowLeft
} from "react-icons/fa";
import "./Security.css";
import { useNavigate } from "react-router-dom";

export default function Security() {
    const [openSections, setOpenSections] = useState({
        driverSecurity: true,
        passengerSecurity: true,
        officerConduct: true,
        roadSafety: true,
        emergencyResponse: true,
    });

    const navigate = useNavigate();

    const toggle = (key) => {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div className="security-container">

            <div className="page-top">
                <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                    <FaArrowLeft />
                </button>

                {/* Header */}
                <div className="security-header">
                    <h1 className="security-title">
                        <FaShieldAlt className="security-icon" />
                        Road Security Experience
                    </h1>
                    <p className="security-subtitle">
                        Guidelines for drivers, passengers, and security agencies to ensure
                        safe, lawful, and respectful road interactions.
                    </p>
                </div>
            </div>

            {/* Driver Security Expectations */}
            <div className="security-card">
                <div className="security-section-title" onClick={() => toggle("driverSecurity")}>
                    <FaCarSide /> Driver Security Responsibilities
                    <span>{openSections.driverSecurity ? "▲" : "▼"}</span>
                </div>

                <div
                    className={`security-section-content ${openSections.driverSecurity ? "expanded" : "collapsed"
                        }`}
                >
                    <ul>
                        <li>Cooperate respectfully with security personnel during stops.</li>
                        <li>Always carry valid driving papers, ID, and vehicle documents.</li>
                        <li>Avoid confrontation—request clarification calmly when needed.</li>
                        <li>Report suspicious activities or potential threats on the road.</li>
                        <li>Keep vehicle doors locked and avoid picking unknown individuals at night.</li>
                    </ul>
                </div>
            </div>

            {/* Passenger Security Expectations */}
            <div className="security-card">
                <div className="security-section-title" onClick={() => toggle("passengerSecurity")}>
                    <FaUsers /> Passenger Security Best Practices
                    <span>{openSections.passengerSecurity ? "▲" : "▼"}</span>
                </div>

                <div
                    className={`security-section-content ${openSections.passengerSecurity ? "expanded" : "collapsed"
                        }`}
                >
                    <ul>
                        <li>Remain alert and observant while boarding and during the trip.</li>
                        <li>Avoid confrontations with drivers or officers; report issues responsibly.</li>
                        <li>Keep personal belongings secure and avoid displaying valuables.</li>
                        <li>Inform trusted persons about your route, especially long trips.</li>
                        <li>Exit immediately if you sense danger or suspicious driver behavior.</li>
                    </ul>
                </div>
            </div>

            {/* Security Officers Conduct */}
            <div className="security-card">
                <div className="security-section-title" onClick={() => toggle("officerConduct")}>
                    <FaUserSecret /> Security Officers Conduct & Duties
                    <span>{openSections.officerConduct ? "▲" : "▼"}</span>
                </div>

                <div
                    className={`security-section-content ${openSections.officerConduct ? "expanded" : "collapsed"
                        }`}
                >
                    <ul>
                        <li>Officers must display ID and operate professionally at checkpoints.</li>
                        <li>Searches must be conducted lawfully, respectfully, and without harassment.</li>
                        <li>Officers must avoid extortion, threats, intimidation, or unlawful detentions.</li>
                        <li>Communication should be clear, calm, and free from aggression.</li>
                        <li>Officers must ensure drivers and passengers feel safe, not threatened.</li>
                    </ul>
                </div>
            </div>

            {/* Road Security Measures */}
            <div className="security-card">
                <div className="security-section-title" onClick={() => toggle("roadSafety")}>
                    <FaExclamationTriangle /> Road Security Measures & Awareness
                    <span>{openSections.roadSafety ? "▲" : "▼"}</span>
                </div>

                <div
                    className={`security-section-content ${openSections.roadSafety ? "expanded" : "collapsed"
                        }`}
                >
                    <ul>
                        <li>Security checkpoints help reduce crime, vehicle theft, and road attacks.</li>
                        <li>Drivers should slow down and follow officer instructions at roadblocks.</li>
                        <li>Passengers should maintain calm and avoid escalating situations.</li>
                        <li>Night travel requires extra caution around poorly lit checkpoints.</li>
                        <li>Stay informed about safe routes and avoid high-risk areas when possible.</li>
                    </ul>
                </div>
            </div>

            {/* Emergency Response */}
            <div className="security-card">
                <div className="security-section-title" onClick={() => toggle("emergencyResponse")}>
                    <FaShieldAlt /> Emergency Response & Reporting
                    <span>{openSections.emergencyResponse ? "▲" : "▼"}</span>
                </div>

                <div
                    className={`security-section-content ${openSections.emergencyResponse ? "expanded" : "collapsed"
                        }`}
                >
                    <ul>
                        <li>Report emergencies immediately to FRSC, Police, or local security units.</li>
                        <li>Drivers should assist in emergencies only when safe and legal to do so.</li>
                        <li>Passengers should document incidents courteously and avoid interfering.</li>
                        <li>Provide accurate details when reporting an accident, crime, or threat.</li>
                        <li>Officers must respond promptly and offer support to victims.</li>
                    </ul>
                </div>
            </div>

            {/* Register Button */}
            <div className="security-register-container">
                <button className="security-register-btn" onClick={() => navigate("/register")}>
                    <FaUserPlus className="security-register-icon" /> Register Now
                </button>
            </div>
        </div>
    );
}
