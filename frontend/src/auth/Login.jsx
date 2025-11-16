import React from "react";
import "./../styles/Login.css";
import "./../assets/image.jpg"
import "./../assets/image-left.png"

function Login() {
  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="typ-page-title">Login your account</h1>
        <p className="typ-subtext">
          Welcome back! We're glad to see you again — let's get you signed in.
        </p>

        <form className="login-form">
          <label className="typ-form-label">Email</label>
          <input
            className="typ-body-lg"
            type="email"
            placeholder="Enter your email"
          />

          <label className="typ-form-label">Password</label>
          <input
            className="typ-body-lg"
            type="password"
            placeholder="Enter your password"
          />

          <button className="typ-button">Register</button>

          <div className="typ-button">
            <img src="/assets/image.png" alt="icon" />
            <span>Continue with Google</span>
          </div>

          <p className="typ-body-lg">
            Already have an account? <span>Log in</span>
          </p>
        </form>
      </div>

      <div className="login-right">
        <img
          src="/assets/image-left.jpg"
          alt="Illustration"
          className="illustration"
        />
      </div>
    </div>
  );
}

export default Login;