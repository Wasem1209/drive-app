import { useState } from "react";
import "./../styles/Auth.css";
import { registerUser } from "../api/auth";
import illustration from "./../assets/image-left.jpg";
import { Link } from "react-router-dom";


function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

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

    try {
      const res = await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (res.success) {
        alert("Account created successfully! Please login.");
        window.location.href = "/login"; // redirect to login
      } else {
        setServerError(res.message || "Registration failed");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-left">
          <div className="auth-intro">
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-sub">
              Your vehicle’s compliance status, verified in seconds. Fast, secure, and corruption-free.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {serverError && <p className="error-msg">{serverError}</p>}

            {/* Full Name */}
            <div className={`field ${errors.fullName ? "field-error" : ""}`}>
              <input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder=" "
                className="input"
              />
              <label htmlFor="fullName" className="label">Full Name</label>
              {errors.fullName && <div className="error-msg">{errors.fullName}</div>}
            </div>

            {/* Email */}
            <div className={`field ${errors.email ? "field-error" : ""}`}>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                className="input"
              />
              <label htmlFor="email" className="label">Email</label>
              {errors.email && <div className="error-msg">{errors.email}</div>}
            </div>

            {/* Password */}
            <div className={`field ${errors.password ? "field-error" : ""}`}>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                className="input"
              />
              <label htmlFor="password" className="label">Password</label>
              {errors.password && <div className="error-msg">{errors.password}</div>}
            </div>

            {/* Confirm Password */}
            <div className={`field ${errors.confirmPassword ? "field-error" : ""}`}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder=" "
                className="input"
              />
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              {errors.confirmPassword && <div className="error-msg">{errors.confirmPassword}</div>}
            </div>

            {/* Role */}
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
                <option value="officer">Officer</option>
                <option value="admin">Admin</option>
              </select>
              <label htmlFor="role" className="label small-label">Account type</label>
              {errors.role && <div className="error-msg">{errors.role}</div>}
            </div>

            <button type="submit" className="btn-primary">Register</button>
          </form>

          <p className="auth-foot">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>

        <div className="auth-right">
          <img src={illustration} alt="" className="auth-illustration" />
        </div>
      </div>
    </div>
  );
}

export default Register;
