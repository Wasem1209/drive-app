import React from "react";
import "./../styles/Verify.css";
import "./../assets/image-left.jpg";

function Verify() {
  return (
    <div className="verify-container">
      <div className="verify-left">
        <h1 className="typ-page-title">Verify your account</h1>
        <p className=".typ-subtext">
          We’ve sent a 4-digit verification code to your email.<br />
          <span >emekad777@gmail.com</span>
        </p>

        <div className="verify-code-inputs">
          {[1, 2, 3, 4].map((i) => (
            <input
              key={i}
              type="text"
              maxLength="1"
              className="verify-code-input"
            />
          ))}
        </div>

        <button className="typ-button">Register</button>

        <p className="typ-button">
          Didn’t receive the email? <span className="typ-button">click here to resend it</span>
        </p>

        <p className="typ-body-lg">Change email</p>
      </div>

      <div className="verify-right">
        <img
          src="/../assets/imageleft.jpg"
          alt="Illustration"
          className="illustration"
        />
      </div>
    </div>
  );
}

export default Verify;