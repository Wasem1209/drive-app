import { Link } from "react-router-dom";
import { motion as MOTION } from "framer-motion";
import {
  FaCar,            // Driver
  FaUserFriends,    // Passenger
  FaShieldAlt,      // Security
  FaTrafficLight    // FRSC
} from "react-icons/fa";
import "./Home.css";
import illustration from "./../assets/image-left.jpg";

export default function Home() {
  return (
    <section className="home-page">
      <div className="home-hero">
        <MOTION.div
          className="hero-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="hero-title">Explore the system — Drive with confidence</h1>

          <p className="hero-subtitle">
            Road compliance checks, payments and reviews — fast, secure, and transparent for drivers, passengers and officers.
          </p>

          <Link to="/register" className="hero-cta">Create an account</Link>
        </MOTION.div>

        <MOTION.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <div className="hero-visual-bg">
            <img src={illustration} alt="Vehicle compliance illustration" className="hero-illustration" />
          </div>
        </MOTION.div>
      </div>

      <MOTION.div
        className="cards-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >

        <Link to="/drivers" className="card-link">
          <MOTION.div whileHover={{ scale: 1.02 }} className="card">
            <div className="card-icon"><FaCar size={44} color="#0b4aa2" /></div>
            <div className="card-content">
              <div className="card-title">Driver Experience</div>
              <div className="card-sub">Tools to manage vehicles, fines and compliance.</div>
            </div>
          </MOTION.div>
        </Link>

        <Link to="/passenger" className="card-link">
          <MOTION.div whileHover={{ scale: 1.02 }} className="card">
            <div className="card-icon"><FaUserFriends size={44} color="#0b4aa2" /></div>
            <div className="card-content">
              <div className="card-title">Passenger Experience</div>
              <div className="card-sub">Quick verification and transparent journey records.</div>
            </div>
          </MOTION.div>
        </Link>

        <Link to="/safety" className="card-link">
          <MOTION.div whileHover={{ scale: 1.02 }} className="card">
            <div className="card-icon"><FaTrafficLight size={44} color="#0b4aa2" /></div>
            <div className="card-content">
              <div className="card-title">FRSC / Compliance</div>
              <div className="card-sub">Official workflows for road safety enforcement.</div>
            </div>
          </MOTION.div>
        </Link>

        <Link to="/security" className="card-link">
          <MOTION.div whileHover={{ scale: 1.02 }} className="card">
            <div className="card-icon"><FaShieldAlt size={44} color="#0b4aa2" /></div>
            <div className="card-content">
              <div className="card-title">Security</div>
              <div className="card-sub">Secure identity and review tools for officers.</div>
            </div>
          </MOTION.div>
        </Link>

      </MOTION.div>
    </section>
  );
}
