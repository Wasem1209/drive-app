import React from "react";
import "./../styles/Auth.css";
import google_icon from "./../assets/image.png"
import illustration from "./../assets/image-left.jpg"

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-left">

        <div display="flex" flexDirection="column" width="100%" max-width="598px" height="auto">
         <h1 className="typ-page-title">Login your account</h1>
         <p className="typ-subtext">
          Welcome back! We're glad to see you again — let's get you signed in.
         </p>
        </div>

        <div className="login-form"> 
         <form style={{ display:"flex", flexDirection:"column", gap:"24px", width:"auto"}}>
          <div>
           <label className="typ-form-label">Email</label>
           <input className="typ-body-lg form-input" type="email" placeholder="Enter your email"/>
          </div>

          <div>
           <label className="typ-form-label">Password</label>
          < input className="typ-body-lg form-input" type="password" placeholder="Enter your password"/>
          </div>
         </form>
        </div>

        <div
          style={{
            display:"flex", 
            flexDirection:"column", 
            width:"100%", 
            height:"auto", 
            gap:"16px", 
            textAlign:"center",
            marginTop:"24px",
            alignItems:"center",
          
          }} 
          className="login-actions"
        >
          <button className="typ-button auth-btn">Register</button>
        
          <button className="typ-button auth-btn auth-btn-google">
           <img src={google_icon} alt="Google icon"/>Continue with Google
          </button>
          
          <p className="typ-body-lg">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>

      </div>

      <div className="login-right">
        <img
          src={illustration}
          alt="Illustration"
          className="illustration"
        />
      </div>
    </div>
  );
}

