import React, { useState, useEffect } from 'react';
import "../css/login.css";
import "./Signup";
import imageGoogle from "../assets/login/providers/google.png";
import imageFacebook from "../assets/login/providers/facebook.png";
import { auth, isLoggedIn } from "../auth/Auth";
import PageNotFound from "./PageNotFound";

import { 
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { clearInputField } from '../misc/Misc';
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

function Login() {
  const navigate = useNavigate();
  const [emailInput, setEmail] = useState('');
  const [passwordInput, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.body.style.background =
      "linear-gradient(to right, #1d1d1e, #930505)";
    document.body.style.height = "100vh";
    document.body.style.display = "flex";
    document.body.style.alignItems = "center";
    document.body.style.justifyContent = "center";
    document.body.style.margin = "0"; // Ensure no default margin

    return () => {
      document.body.style = {}; // Clean up on component unmount
    };
  }, []);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, emailInput);
    } catch (err) {
      console.error(err);
    }
  };

  return !isAuthorized ? (
    <section>
      <Navbar />
      <div className="container">
        <div className="card">
          <h3 className="app-title" style={{ color: '#ffffff' }}>Login</h3>
          <div className="auth-fields-and-buttons">
            <input type="email" placeholder="Enter your Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Enter your Password" onChange={(e) => setPassword(e.target.value)} title="Password" />
            <button className="forget-btn" style={{ marginTop: "-1em", marginLeft: "0.2em" }} onClick={handleForgotPassword}>
              Forgot password?
            </button>
            <button id="sign-in-btn" className="loginButton" onClick={AuthSignInWithEmail} style={{ minWidth: "21rem" }}>
              Continue
            </button>
            <div className="horizontal-container">
              <p style={{ padding: 0, minWidth: '200px', marginLeft: '1em', marginRight: '-4em', fontSize: "12px" }}>
                Don't have an account?
              </p>
              <button className="forget-btn" style={{ padding: 0, marginTop: "-0.2rem" }} onClick={() => navigate("/signup")}>
                Sign up
              </button>
            </div>
            <div className="provider-buttons">
              <button id="sign-in-with-google-btn" className="provider-fb-btn" onClick={AuthSignInWithGoogle}>
                <img src={imageGoogle} className="provider-g-btn-logo" alt="Google logo" />
                Continue with Google
              </button>
            </div>
            <div className="provider-buttons">
              <button id="sign-in-with-facebook-btn" className="provider-fb-btn" onClick={AuthSignInWithFacebook}>
                <img src={imageFacebook} className="provider-fb-btn-logo" alt="Facebook logo" />
                Continue with Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <PageNotFound />
  );

  function clearAuthFields(fields) {
    clearInputField(emailInput);
    clearInputField(passwordInput);
  }

  function AuthSignInWithGoogle() {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log("Signed in with Google");
        navigate("../home");
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  function AuthSignInWithFacebook() {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        console.log("Signed in with Facebook");
        navigate("../home");
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  function AuthSignInWithEmail() {
    signInWithEmailAndPassword(auth, emailInput, passwordInput)
      .then((userCredential) => {
        console.log("Signed in with Email");
        navigate("../home");
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

export default Login;
