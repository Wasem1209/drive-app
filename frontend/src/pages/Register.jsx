import { useState } from "react";
import "./../styles/Auth.css";
import { registerUser } from "../api/auth";
import illustration from "./../assets/image-left.jpg";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.role) newErrors.role = "Select an account type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError("");

    try {
      const res = await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (res.success) {
        setShowSuccessModal(true); // show modal
      } else {
        setServerError(res.message || "Registration failed");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page register-page">
      <div className="auth-shell register-shell">
        <div className="auth-left register-left">
          <div className="register-card" role="region" aria-label="Create account">
            <div className="register-top">
              <button type="button" className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                <FaArrowLeft />
              </button>

              <div className="auth-intro">
                <h1 className="auth-title">Create your account</h1>
                <p className="auth-sub">
                  Your vehicle’s compliance status, verified in seconds. Fast, secure, and corruption-free.
                </p>
              </div>
            </div>

            <form className="auth-form register-form" onSubmit={handleSubmit} noValidate>
              {serverError && <p className="error-msg" role="alert">{serverError}</p>}

              <div className={`field register-field ${errors.fullName ? "field-error" : ""}`}>
                <input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder=" "
                  className="input"
                  autoComplete="name"
                />
                <label htmlFor="fullName" className="label">Full name</label>
                {errors.fullName && <div className="error-msg">{errors.fullName}</div>}
              </div>

              <div className={`field register-field ${errors.email ? "field-error" : ""}`}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                  className="input"
                  autoComplete="email"
                />
                <label htmlFor="email" className="label">Email</label>
                {errors.email && <div className="error-msg">{errors.email}</div>}
              </div>

              <div className={`field register-field ${errors.password ? "field-error" : ""}`}>
                <div className="input-affix">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder=" "
                    className="input"
                    autoComplete="new-password"
                  />
                  <label htmlFor="password" className="label">Password</label>
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
                {errors.password && <div className="error-msg">{errors.password}</div>}
              </div>

              <div className={`field register-field ${errors.confirmPassword ? "field-error" : ""}`}>
                <div className="input-affix">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder=" "
                    className="input"
                    autoComplete="new-password"
                  />
                  <label htmlFor="confirmPassword" className="label">Confirm password</label>
                  <button
                    type="button"
                    className="affix-btn"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    aria-pressed={showConfirmPassword}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.confirmPassword && <div className="error-msg">{errors.confirmPassword}</div>}
              </div>

              <div className={`field ${errors.role ? "field-error" : ""}`}>
                <div className="role-label">Account type</div>
                <div className="role-grid" role="radiogroup" aria-label="Account type">
                  {[
                    { value: "driver", label: "Driver" },
                    { value: "passenger", label: "Passenger" },
                    { value: "officer", label: "Officer" },
                    { value: "admin", label: "Admin" },
                  ].map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      className={`role-tile ${formData.role === r.value ? "active" : ""}`}
                      onClick={() => setFormData((p) => ({ ...p, role: r.value }))}
                      role="radio"
                      aria-checked={formData.role === r.value}
                    >
                      <span className="role-title">{r.label}</span>
                      <span className="role-sub">Select</span>
                    </button>
                  ))}
                </div>
                {errors.role && <div className="error-msg">{errors.role}</div>}
              </div>

              <button type="submit" className="btn-primary register-cta" disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>

            <p className="auth-foot register-foot">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>

        <div className="auth-right register-right" aria-hidden="true">
          <div className="register-visual">
            <img src={illustration} alt="" className="auth-illustration register-illustration" />
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Account created">
          <div className="modal-box">
            <div className="success-badge" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Account created</h2>
            <p className="modal-sub">Your account has been created successfully. You can now log in.</p>

            <button className="modal-btn" onClick={() => navigate("/login")}>Go to Login</button>
            <button className="modal-close" onClick={() => setShowSuccessModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
