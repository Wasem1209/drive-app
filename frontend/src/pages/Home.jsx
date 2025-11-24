import { Link } from "react-router-dom";
import { motion as MOTION } from "framer-motion";
import {
  FaCar,            // Driver
  FaUserFriends,    // Passenger
  FaShieldAlt,      // Security
  FaTrafficLight    // FRSC
} from "react-icons/fa";

import "./Home.css";

export default function Home() {
  return (
    <section className="hero-section">

      <MOTION.div
        className="hero-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="hero-title">
          Explore the World,
          <br /> Feel the system
        </h1>

        <p className="hero-subtitle">
          Join us for unforgettable travel experiences tailored to your dreams and desires.
        </p>

        <Link to="/register" className="hero-button">
          Start Your Adventure
        </Link>
      </MOTION.div>

      <MOTION.div
        className="cards-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >

        {/* DRIVER EXPERIENCE */}
        <Link to="/drivers" className="card-link">
          <MOTION.div whileHover={{ scale: 1.03 }} className="card">
            <span className="card-badge" style={{ color: "#2563EB", backgroundColor: "#DBEAFE" }}>
              Driver Experience
            </span>
            <div className="card-icon">
              <FaCar size={65} color="#2563EB" />
            </div>
          </MOTION.div>
        </Link>

        {/* PASSENGER EXPERIENCE */}
        <Link to="/passenger" className="card-link">
          <MOTION.div whileHover={{ scale: 1.03 }} className="card">
            <span className="card-badge" style={{ color: "#DB2777", backgroundColor: "#FCE7F3" }}>TPS Experience
            </span>
            <div className="card-icon">
              <FaUserFriends size={65} color="#DB2777" />
            </div>
          </MOTION.div>
        </Link>

        {/* FRSC EXPERIENCE */}
        <Link to="/safety" className="card-link">
          <MOTION.div whileHover={{ scale: 1.03 }} className="card">
            <span className="card-badge" style={{ color: "#7C3AED", backgroundColor: "#F3E8FF" }}>
              FRSC Experience
            </span>
            <div className="card-icon">
              <FaTrafficLight size={65} color="#7C3AED" />
            </div>
          </MOTION.div>
        </Link>

        {/* SECURITY EXPERIENCE */}
        <Link to="/security" className="card-link">
          <MOTION.div whileHover={{ scale: 1.03 }} className="card">
            <span className="card-badge" style={{ color: "#059669", backgroundColor: "#D1FAE5" }}>
              Security Experience
            </span>
            <div className="card-icon">
              <FaShieldAlt size={65} color="#059669" />
            </div>
          </MOTION.div>
        </Link>

      </MOTION.div>
    </section>
  );
}
