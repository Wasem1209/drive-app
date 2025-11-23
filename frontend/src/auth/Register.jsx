import { useState } from "react";
import "./../styles/Auth.css";
import illustration from "./../assets/image-left.jpg"; // keep this or replace with the screenshot path for dev

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // call API here
      console.log("submit", formData);
      alert("Form submitted (dev stub)");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        {/* Left column: title + form */}
        <div className="auth-left">
          <div className="auth-intro">
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-sub">
              Your vehicle’s compliance status, verified in seconds. Fast,
              secure, and corruption-free.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* NAME */}
            <div className={`field ${errors.name ? "field-error" : ""}`}>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
                className="input"
                autoComplete="name"
              />
              <label htmlFor="name" className="label">
                Full name
              </label>
              {errors.name && <div className="error-msg">{errors.name}</div>}
            </div>

            {/* EMAIL */}
            <div className={`field ${errors.email ? "field-error" : ""}`}>
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
              <label htmlFor="email" className="label">
                Email address
              </label>
              {errors.email && <div className="error-msg">{errors.email}</div>}
            </div>

            {/* PASSWORD */}
            <div className={`field ${errors.password ? "field-error" : ""}`}>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                className="input"
                autoComplete="new-password"
              />
              <label htmlFor="password" className="label">
                Password
              </label>
              {errors.password && (
                <div className="error-msg">{errors.password}</div>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div
              className={`field ${errors.confirmPassword ? "field-error" : ""}`}
            >
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder=" "
                className="input"
                autoComplete="new-password"
              />
              <label htmlFor="confirmPassword" className="label">
                Confirm password
              </label>
              {errors.confirmPassword && (
                <div className="error-msg">{errors.confirmPassword}</div>
              )}
            </div>

            {/* ROLE */}
            <div className={`field select-field ${errors.role ? "field-error" : ""}`}>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input select-input"
              >
                <option value="">Choose account type</option>
                <option value="driver">Driver</option>
                <option value="passenger">Passenger</option>
                <option value="police">Police / Security</option>
                <option value="admin">Admin</option>
              </select>
              <label htmlFor="role" className="label small-label">
                Account type
              </label>
              {errors.role && <div className="error-msg">{errors.role}</div>}
            </div>

            <button type="submit" className="btn-primary">
              Register
            </button>
          </form>

          <p className="auth-foot">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>

        {/* Right column: illustration (desktop only) */}
        <div className="auth-right" aria-hidden>
          <img
            src={illustration}
            alt=""
            className="auth-illustration"
          // if you prefer to preview the screenshot uploaded:
          // src="/mnt/data/e78f1f4a-eed1-4619-a60f-c4af3c9cbc12.png"
          />
        </div>
      </div>
    </div>
  );
}

export default Register;