import React, { useState, useContext } from "react";
import "./../styles/Auth.css";
import { loginUser } from "../api/auth";
import { AuthContext } from "../auth/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const payload = { email, password };

    try {
      const res = await loginUser(payload);

      if (res.success) {
        // Save token and role in AuthContext
        login(res.token, res.role);

        // Redirect to dashboard based on role
        switch (res.role) {
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
      } else {
        setError(res.message || "Invalid email or password");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

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

          <button className="auth-btn" type="submit">
            Login
          </button>

          <p className="login-link">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </form>
      </div>

      <div className="login-right">
        {/* Optional illustration can go here */}
      </div>
    </div>
  );
}
