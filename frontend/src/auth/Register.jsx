import "./../styles/Auth.css";
import illustration from "./../assets/image-left.jpg"; 
import google_icon from "./../assets/image.png";

function Register() {
  return (
    <div className="register-container">
      <div className="register-left">

        <div display="flex" flexDirection="column" width="100%" max-width="598px" height="auto">
         <h1 className="typ-page-title">Create your account</h1>
         <p className="typ-subtext">
          Your vehicle’s compliance status, verified in seconds. Fast, secure,
          and corruption-free.
         </p>
        </div>

        <div>
         <form className="register-form">
          <label className="typ-form-label">Name</label>
          <input className="typ-body-lg" type="text" placeholder="Enter your name" />
          
          <label className="typ-form-label">Email</label>
          <input className="typ-body-lg" type="email" placeholder="Enter your email" />

          <label className="typ-form-label">Password</label>
          <input className="typ-body-lg" type="password" placeholder="Set a password" />

          <label className="typ-form-label">Confirm password</label>
          <input className="typ-body-lg" type="password" placeholder="Confirm password" />
         </form>
        </div>
        
        <div className="register-actions">
          <button className="typ-button">Register</button>
        
          <button className="typ-button">
           <img scale="crop" width="19.25px" height="20px"
            src={google_icon}
            alt="Google icon"/>Continue with Google
          </button>

          <p className="typ-body-lg">
          Already have an account? <a href="/login">Log in</a>
          </p>
        </div>  
      </div>

      <div className="register-right">
        <img className="illustration" src={illustration} alt="Illustration" />
      </div>
    </div>
  );
}

export default Register;
