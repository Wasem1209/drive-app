import "./../styles/Register.css";
import illustration from "./../assets/image-left.jpg"; 
import "./../assets/image.jpg"

function Register() {
  return (
    <div className="register-container">
      <div className="register-left">
        <h1 className="typ-page-title">Create your account</h1>
        <p className="typ-subtext">
          Your vehicle’s compliance status, verified in seconds. Fast, secure,
          and corruption-free.
        </p>

        <form className="register-form">
          <label className="typ-form-label">Name</label>
          <input className="typ-body-lg" type="text" placeholder="Enter your name" />

          <label className="typ-form-label">Email</label>
          <input className="typ-body-lg" type="email" placeholder="Enter your email" />

          <label className="typ-form-label">Password</label>
          <input className="typ-body-lg" type="password" placeholder="Set a password" />

          <label className="typ-form-label">Confirm password</label>
          <input className="typ-body-lg" type="password" placeholder="Confirm password" />

          <button className=".typ-button">Register</button>
        </form>

        <button className=".typ-button">
          <img
            src="./../assets/image.jpg"
            alt="Google icon"
          />
          Continue with Google
        </button>

        <p className="typ-body-lg">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>

      <div className="register-right">
        <img className="illustration" src={illustration} alt="Illustration" />
      </div>
    </div>
  );
}

export default Register;
