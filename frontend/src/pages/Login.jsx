import React, { useState, useContext, useEffect, useCallback } from "react";
import "./../styles/Auth.css";
import { loginUser } from "../api/auth";
import { AuthContext } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import illustration from "./../assets/image-left.jpg";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      console.log("Login API response:", res);

      if (res.success) {
        login(res.token, res.role);
        setUserRole(res.role);
        setShowSuccessModal(true);
      } else {
        setError(res.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect function wrapped with useCallback
  const handleRedirect = useCallback(() => {
    setShowSuccessModal(false);

    switch (userRole) {
      case "driver":
        window.location.href = "/dashboard/driver";
        break;
      case "passenger":
        window.location.href = "/dashboard/passenger";
        break;
      case "officer":
        window.location.href = "/dashboard/officer";
        break;
      case "admin":
        window.location.href = "/dashboard/admin";
        break;
      default:
        window.location.href = "/";
    }
  }, [userRole]);

  // Automatically close modal and redirect after 3 seconds
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        handleRedirect();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, handleRedirect]);

  return (
    <div className="auth-page login-page">
      <div className="auth-shell login-shell">
        <div className="auth-left login-left">
          <div className="login-card" role="region" aria-label="Login">
            <div className="login-top">
              <button type="button" className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                <FaArrowLeft />
              </button>

              <div className="auth-intro">
                <h1 className="auth-title">Login to your account</h1>
                <p className="auth-sub">Secure access to your dashboard and compliance records.</p>
              </div>
            </div>

            <form className="auth-form login-form" onSubmit={handleLogin}>
              {error && (
                <p className="error-msg" role="alert">
                  {error}
                </p>
              )}

              <div className="field register-field">
                <input
                  id="loginEmail"
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  autoComplete="email"
                  required
                />
                <label className="label" htmlFor="loginEmail">Email</label>
              </div>

              <div className="field register-field">
                <div className="input-affix">
                  <input
                    id="loginPassword"
                    type={showPassword ? "text" : "password"}
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=" "
                    autoComplete="current-password"
                    required
                  />
                  <label className="label" htmlFor="loginPassword">Password</label>
                  <button
                    type="button"
                    className="affix-btn"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-pressed={showPassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button className="btn-primary login-cta" type="submit" disabled={loading}>
                {loading ? "Logging in…" : "Login"}
              </button>

              <p className="auth-foot login-foot">
                Don&apos;t have an account? <Link to="/register">Sign up</Link>
              </p>
            </form>
          </div>
        </div>

        <div className="auth-right login-right" aria-hidden="true">
          <div className="login-visual">
            <img src={illustration} alt="" className="auth-illustration login-illustration" />
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Login successful">
          <div className="modal-box">
            <div className="success-badge" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Login successful</h2>
            <p className="modal-sub">Welcome back! Redirecting to your dashboard…</p>
            <button className="modal-btn" onClick={handleRedirect}>Go to Dashboard Now</button>
            <button className="modal-close" onClick={() => setShowSuccessModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
