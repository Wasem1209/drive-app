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

        <div className="register-form">
         <form style={{ display:"flex", flexDirection:"column", gap:"24px", width:"auto"}}>

          <div>
            <label className="typ-form-label">Name</label>
            <input className="typ-body-lg form-input" type="text" placeholder="Enter your name" />
          </div>

          <div>
            <label className="typ-form-label">Email</label>
            <input className="typ-body-lg form-input" type="email" placeholder="Enter your email" />
          </div>

          <div>
            <label className="typ-form-label">Password</label>
            <input className="typ-body-lg form-input" type="password" placeholder="Set a password" />
          </div>

          <div>
            <label className="typ-form-label">Confirm password</label>
            <input className="typ-body-lg form-input" type="password" placeholder="Confirm password" />
          </div>

         </form>
        </div>
        
        <div style={{
            display:"flex", 
            flexDirection:"column", 
            width:"100%", 
            height:"auto", 
            gap:"16px", 
            textAlign:"center",
            marginTop:"24px",
            alignItems:"center",
          
          }} className="register-actions">
          <button className="typ-button auth-btn">Register</button>
        
          <button className="typ-button auth-btn auth-btn-google">
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
