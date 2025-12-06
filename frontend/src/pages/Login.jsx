import React, { useState, useContext, useEffect, useCallback } from "react";
import "./../styles/Auth.css";
import { loginUser } from "../api/auth";
import { AuthContext } from "../auth/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userRole, setUserRole] = useState("");

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
    <div className="login-container">
      <div className="login-left">
        <div className="login-text">
          <h1 className="typ-page-title">Login to your account</h1>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="login-link">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </form>
      </div>

      <div className="login-right">
        {/* Optional illustration */}
      </div>

      {/* Success Modal */}
   {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Login Successful 🎉</h2>
            <p>Welcome back! Redirecting to your dashboard...</p>
            <button className="modal-btn" onClick={handleRedirect}>
              Go to Dashboard Now
            </button>
            <button
              className="modal-close"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
