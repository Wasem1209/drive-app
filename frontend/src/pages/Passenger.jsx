import React, { useState } from 'react';
import { FaChair, FaBus, FaSmile, FaClipboardList, FaHeartbeat, FaUserPlus } from 'react-icons/fa';
import './Passenger.css';
import { useNavigate } from 'react-router-dom';

export default function Passenger() {
  const [openSections, setOpenSections] = useState({
    comfort: true,
    education: true,
    safety: true,
    feedback: true,
  });

  const navigate = useNavigate();

  const toggle = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="passenger-container">

      {/* Header */}
      <div className="passenger-header">
        <h1 className="header-title">
          <FaBus className="header-icon" />
          Modern Passenger Experience
        </h1>
        <p className="header-subtitle">
          A safe, secure, and educational transport system aligned with FCT / FRSC standards
        </p>
      </div>

      {/* Comfort & Accessibility */}
      <div className={`section-card ${openSections.comfort ? 'open' : 'collapsed'}`}>
        <div className="section-title" onClick={() => toggle('comfort')}>
          <FaChair /> Comfort & Accessibility
          <span className="toggle-btn">{openSections.comfort ? '▲' : '▼'}</span>
        </div>
        <div className={`section-content ${openSections.comfort ? 'expanded' : 'collapsed'}`}>
          <ul>
            <li>Ergonomic seating and ample space for passengers.</li>
            <li>Special provisions for elderly, children, and persons with disabilities.</li>
            <li>Cleanliness and hygiene maintained in all vehicles.</li>
            <li>Emergency preparedness: clearly marked exits, seat belts, and safety instructions.</li>
          </ul>
        </div>
      </div>

      {/* Passenger Education & Awareness */}
      <div className={`section-card ${openSections.education ? 'open' : 'collapsed'}`}>
        <div className="section-title" onClick={() => toggle('education')}>
          <FaSmile /> Passenger Education & Awareness
          <span className="toggle-btn">{openSections.education ? '▲' : '▼'}</span>
        </div>
        <div className={`section-content ${openSections.education ? 'expanded' : 'collapsed'}`}>
          <ul>
            <li>Educating passengers on safe boarding, seating, and disembarking procedures.</li>
            <li>Information about the modern FCT transport system and its features.</li>
            <li>Awareness of passenger rights and responsibilities.</li>
            <li>Encouraging courteous behavior for a pleasant journey.</li>
          </ul>
        </div>
      </div>

      {/* Safety & Security */}
      <div className={`section-card ${openSections.safety ? 'open' : 'collapsed'}`}>
        <div className="section-title" onClick={() => toggle('safety')}>
          <FaClipboardList /> Safety & Security Measures
          <span className="toggle-btn">{openSections.safety ? '▲' : '▼'}</span>
        </div>
        <div className={`section-content ${openSections.safety ? 'expanded' : 'collapsed'}`}>
          <ul>
            <li>Vehicle inspections and maintenance conducted regularly.</li>
            <li>CCTV and staff monitoring to ensure compliance with safety rules.</li>
            <li>Emergency response plans for accidents or incidents.</li>
            <li>Passenger and driver coordination for smooth operations and safety.</li>
          </ul>
        </div>
      </div>

      {/* Feedback & Improvement */}
      <div className={`section-card ${openSections.feedback ? 'open' : 'collapsed'}`}>
        <div className="section-title" onClick={() => toggle('feedback')}>
          <FaHeartbeat /> Feedback & Continuous Improvement
          <span className="toggle-btn">{openSections.feedback ? '▲' : '▼'}</span>
        </div>
        <div className={`section-content ${openSections.feedback ? 'expanded' : 'collapsed'}`}>
          <ul>
            <li>Passengers provide feedback on safety, comfort, and service quality.</li>
            <li>Regular surveys and ratings for continuous service improvement.</li>
            <li>Transparent complaint and incident reporting system.</li>
            <li>Feedback analysis ensures updates and changes to the system for optimal safety and convenience.</li>
          </ul>
        </div>
      </div>

      {/* Register Button */}
      <div className="register-container">
        <button className="register-btn" onClick={() => navigate('/register')}>
          <FaUserPlus className="register-icon" /> Register Now
        </button>
      </div>

    </div>
  );
}
