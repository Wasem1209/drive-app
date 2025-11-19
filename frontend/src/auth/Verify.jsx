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
        
        <div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
         <button style={{ backgroundColor:"#023E8A", color:"#FFFFFF", display:"flex", flexDirection:"row"
          , width:"470px", height:"70px", borderRadius:"12px", justifyContent:"center"
          }} className="typ-button">Register</button>

         <p className="typ-button" style={{ color: "#8E8E93", display:"flex", flexDirection:"row"
          , width:"470px", height:"70px", borderRadius:"12px", justifyContent:"center"}}>Didn’t receive the email? {" "} click{" "}
          <a href="#" style={{ color: "blue", textDecoration: "none", cursor: "pointer" }}>here
          </a>{" "} to resend it
         </p>

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