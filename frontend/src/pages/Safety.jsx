import React, { useState } from "react";
import { FaShieldAlt, FaBook, FaEye, FaExclamationTriangle, FaUserPlus, FaArrowLeft } from "react-icons/fa";
import "./Frsc.css";
import { useNavigate } from "react-router-dom";

export default function Frsc() {
    const [openSections, setOpenSections] = useState({
        roles: true,
        education: true,
        safety: true,
        enforcement: true,
    });

    const navigate = useNavigate();

    const toggle = (key) => {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div className="frsc-container">

            <div className="page-top">
                <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                    <FaArrowLeft />
                </button>

                {/* Header */}
                <div className="frsc-header">
                    <h1 className="header-title">
                        <FaShieldAlt className="header-icon" />
                        FRSC Road Safety Guidelines
                    </h1>
                    <p className="header-subtitle">
                        What every driver and passenger must know about compliance, safety, and responsible road use.
                    </p>
                </div>
            </div>

            {/* Roles & Responsibilities */}
            <div className="section-card">
                <div className="section-title" onClick={() => toggle("roles")}>
                    <FaShieldAlt /> FRSC Roles & Responsibilities
                    <span className="toggle-btn">{openSections.roles ? "▲" : "▼"}</span>
                </div>

                <div className={`section-content ${openSections.roles ? "expanded" : "collapsed"}`}>
                    <ul>
                        <li>Enforcing road traffic laws and reducing crashes nationwide.</li>
                        <li>Issuing driver’s licenses, plate numbers, and vehicle documentation.</li>
                        <li>Responding to road emergencies and rescuing accident victims.</li>
                        <li>Conducting highway patrols and motor park inspections.</li>
                    </ul>
                </div>
            </div>

            {/* Passenger & Driver Education */}
            <div className="section-card">
                <div className="section-title" onClick={() => toggle("education")}>
                    <FaBook /> Road User Education
                    <span className="toggle-btn">{openSections.education ? "▲" : "▼"}</span>
                </div>

                <div className={`section-content ${openSections.education ? "expanded" : "collapsed"}`}>
                    <ul>
                        <li>Understanding road signs, speed limits, and lane discipline.</li>
                        <li>Passengers and drivers must cooperate to ensure safe transport.</li>
                        <li>FRSC educates the public on accident prevention and safe transport habits.</li>
                        <li>Promotes use of seatbelts, child restraints, and safety equipment.</li>
                    </ul>
                </div>
            </div>

            {/* Safety Practices */}
            <div className="section-card">
                <div className="section-title" onClick={() => toggle("safety")}>
                    <FaEye /> Safety Expectations for All Road Users
                    <span className="toggle-btn">{openSections.safety ? "▲" : "▼"}</span>
                </div>

                <div className={`section-content ${openSections.safety ? "expanded" : "collapsed"}`}>
                    <ul>
                        <li>Drivers must maintain proper vehicle documentation and roadworthiness.</li>
                        <li>No use of mobile phones while driving.</li>
                        <li>Passengers should report reckless driving immediately.</li>
                        <li>Drivers must avoid overloading and maintain safe speed limits.</li>
                    </ul>
                </div>
            </div>

            {/* Enforcement Warnings */}
            <div className="section-card">
                <div className="section-title" onClick={() => toggle("enforcement")}>
                    <FaExclamationTriangle /> Prohibited Behaviors
                    <span className="toggle-btn">{openSections.enforcement ? "▲" : "▼"}</span>
                </div>

                <div className={`section-content ${openSections.enforcement ? "expanded" : "collapsed"}`}>
                    <ul>
                        <li>Driving without a license, expired documents, or faulty vehicle parts.</li>
                        <li>Ignoring traffic lights, overtaking dangerously, or driving under influence.</li>
                        <li>Parking on road shoulders unnecessarily.</li>
                        <li>Passengers encouraging dangerous driving behavior.</li>
                    </ul>
                </div>
            </div>

            {/* Register Button */}
            <div className="register-container">
                <button className="register-btn" onClick={() => navigate("/register")}>
                    <FaUserPlus className="register-icon" /> Register Now
                </button>
            </div>
        </div>
    );
}
