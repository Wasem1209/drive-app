import React from "react";
import "./../styles/Auth.css";
import { SocialIcon } from "react-social-icons";
import illustration from "./../assets/image-left.jpg";

export default function Login() {
  return (
    <div className="login-container">
      {/* Left section */}
      <div className="login-left">
        <div className="login-text">
          <h1 className="typ-page-title">
            Login to your account
            <span className="gradient-underline"></span>
          </h1>
          <p className="typ-subtext">
            Welcome back! We're glad to see you again — let's get you signed in.
          </p>
        </div>

        <form className="login-form">
          <div className="form-group">
            <label className="typ-form-label">Email</label>
            <input
              className="typ-body-lg form-input"
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label className="typ-form-label">Password</label>
            <input
              className="typ-body-lg form-input"
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="typ-button auth-btn">
            Login
          </button>

          <button type="button" className="typ-button auth-btn auth-btn-google">
            <SocialIcon
              url="https://google.com"
              className="social-icon"
              style={{ height: 24, width: 24 }}
              bgColor="#ffffff"
              fgColor="#ea4335"
            />
            Continue with Google
          </button>

          <p className="typ-body-lg login-link">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </form>
      </div>

      {/* Right section */}
      <div className="login-right">
        <img src={illustration} alt="Illustration" className="illustration" />
      </div>
    </div>
  );
}
