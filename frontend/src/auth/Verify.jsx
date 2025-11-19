import React from "react";
import "./../styles/Verify.css";
import illustration from "./../assets/image-left.jpg";

function Verify() {
  return (
    <div className="verify-container">
      <div className="verify-left">

        <div display="flex" flexDirection="column" width="100%" max-width="598px" height="auto">
         <h1 className="typ-page-title">Verify your account</h1>
         <p className="typ-subtext">
          We’ve sent a 4-digit verification code to your email.<br />
          <span>emekad777@gmail.com</span>
         </p>
        </div>

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
        
        <div 
          style={{
              display:"flex", 
              flexDirection:"column", 
              alignItems:"center",
              textAlign:"center",
            }}
        >
         <button style={{marginBottom:"10px"}} className="typ-button auth-btn">Register</button>

         <a 
            href="/register"
            className="typ-button"
            style={{marginBottom:"32px",
              color:"var(--gray-600)"
            }}
         >
          Didn’t receive the email? click here to resend it
         </a> 

         <a href="#" className="typ-body-lg">Change email</a>
        </div>

      </div>

      <div className="verify-right">
        <img
          src={illustration}
          alt="Illustration"
          className="illustration"
        />
      </div>
    </div>
  );
}

export default Verify;