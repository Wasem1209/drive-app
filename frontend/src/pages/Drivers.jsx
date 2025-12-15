import React, { useState } from 'react';
import { FaCar, FaRoad, FaExclamationTriangle, FaClipboardList, FaCertificate, FaHeartbeat, FaUserPlus, FaArrowLeft } from 'react-icons/fa';
import './Driver.css';
import { useNavigate } from 'react-router-dom';

export default function Driver() {
    const [openSections, setOpenSections] = useState({
        competencies: true,
        experience: true,
        rules: true,
        safety: true,
    });

    const navigate = useNavigate();

    const toggle = (key) => {
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="driver-container">

            <div className="driver-top">
                <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                    <FaArrowLeft />
                </button>

                {/* Header */}
                <div className="driver-header">
                    <h1>
                        <FaCar style={{ marginRight: '10px', verticalAlign: 'middle', color: '#075a5a' }} />
                        Driver Experience Standard
                    </h1>
                    <p>Aligned with FCT / FRSC international driving competencies & rules</p>
                </div>
            </div>

            {/* Driver Experience Requirements */}
            <div className={`section-card ${openSections.competencies ? 'open' : 'collapsed'}`}>
                <div className="section-title" onClick={() => toggle('competencies')}>
                    <FaRoad /> Driver Experience Requirements
                    <span className="toggle-btn">{openSections.competencies ? '▲' : '▼'}</span>
                </div>
                <div
                    className="section-content"
                    style={{ maxHeight: openSections.competencies ? '1000px' : '0', transition: 'max-height 0.5s ease', overflow: 'hidden' }}
                >
                    <ul>
                        <li>Vehicle Control: Smooth acceleration and braking; proper steering; mirror use; gear control.</li>
                        <li>Situational Awareness: Anticipating hazards, maintaining following distances, monitoring road conditions.</li>
                        <li>Decision-Making & Judgment: Defensive driving, calm responses, and safe choices under pressure.</li>
                        <li>Compliance with Laws: Recognize signs, obeying of speed limits, and yield appropriately.</li>
                    </ul>
                </div>
            </div>

            {/* Experience Levels */}
            <div className={`section-card ${openSections.experience ? 'open' : 'collapsed'}`}>
                <div className="section-title" onClick={() => toggle('experience')}>
                    <FaCertificate /> Experience Levels
                    <span className="toggle-btn">{openSections.experience ? '▲' : '▼'}</span>
                </div>
                <div
                    className="section-content"
                    style={{ maxHeight: openSections.experience ? '1000px' : '0', transition: 'max-height 0.5s ease', overflow: 'hidden' }}
                >
                    <ul>
                        <li>Beginner (0–1 year): Basic vehicle handling, supervised training.</li>
                        <li>Intermediate (1–3 years): Varied environments, improved judgment.</li>
                        <li>Advanced / Professional (3+ years): High-level hazard anticipation, professional readiness.</li>
                    </ul>
                </div>
            </div>

            {/* International Rules */}
            <div className={`section-card ${openSections.rules ? 'open' : 'collapsed'}`}>
                <div className="section-title" onClick={() => toggle('rules')}>
                    <FaClipboardList /> International Rules Governing Driving
                    <span className="toggle-btn">{openSections.rules ? '▲' : '▼'}</span>
                </div>
                <div
                    className="section-content"
                    style={{ maxHeight: openSections.rules ? '1000px' : '0', transition: 'max-height 0.5s ease', overflow: 'hidden' }}
                >
                    <ul>
                        <li>Fitness to Drive: Medical fitness, free from impairing substances, avoid fatigue.</li>
                        <li>Legal Requirements: Valid license, insurance, registration, and compliance with traffic laws.</li>
                        <li>Prohibited Practices: No handheld phone use, no DUI, no aggressive driving.</li>
                    </ul>
                </div>
            </div>

            {/* Vehicle Safety & Records */}
            <div className={`section-card ${openSections.safety ? 'open' : 'collapsed'}`}>
                <div className="section-title" onClick={() => toggle('safety')}>
                    <FaCar /> Vehicle Safety & Records
                    <span className="toggle-btn">{openSections.safety ? '▲' : '▼'}</span>
                </div>
                <div
                    className="section-content"
                    style={{ maxHeight: openSections.safety ? '1000px' : '0', transition: 'max-height 0.5s ease', overflow: 'hidden' }}
                >
                    <ul>
                        <li>Maintenance & Inspections: Brakes, lights, tires, emissions, secure loading.</li>
                        <li>Documentation: License, insurance, maintenance logs, incident records.</li>
                        <li>Enforcement: Fines, suspensions, training or recertification if required.</li>
                    </ul>
                </div>
            </div>

            {/* Register Button at the bottom */}
            <div className="register-container">
                <button
                    className="register-btn"
                    onClick={() => navigate('/register')}
                >
                    <FaUserPlus style={{ marginRight: '6px' }} /> Register Now
                </button>
            </div>

        </div>
    );
}
