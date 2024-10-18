import React, { useState, useEffect } from 'react';
import "../css/login.css";
import "./Login";
import { auth, isLoggedIn } from "../auth/Auth";
import { 
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { clearInputField } from '../misc/Misc';
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import PageNotFound from "./PageNotFound";

export default function Signup() {
  const navigate = useNavigate();

  const [emailInput, setEmail] = useState('');
  const [passwordInput, setPassword] = useState('');
  const [confirmPasswordInput, setConfirmPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
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

  const handleSignup = async () => {
    if (passwordInput !== confirmPasswordInput) {
      console.log("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
      await sendEmailVerification(auth.currentUser);
      console.log("Email verification sent!");
      clearAuthFields();
      navigate("../home");
    } catch (error) {
      console.error(error.message);
    }
  };

  const clearAuthFields = () => {
    clearInputField(emailInput);
    clearInputField(passwordInput);
  };

  return !isAuthorized ? (
    <PageNotFound />
  ) : (
    <section>
      <Navbar />
      <div className="container">
        <div className="card">
          <h3 className="app-title" style={{ color: '#ffffff' }}>Sign Up</h3>
          <div className="auth-fields-and-buttons">
            <input
              type="email"
              placeholder="Enter your Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter your Password"
              onChange={(e) => setPassword(e.target.value)}
              title="Password"
            />
            <input
              type="password"
              placeholder="Re-enter Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              id="sign-in-btn"
              className="loginButton"
              onClick={handleSignup}
              style={{ minWidth: "21rem" }}
            >
              Signup
            </button>
            <div className="horizontal-container">
              <p style={{ padding: 0, minWidth: '200px', marginLeft: '1em', marginRight: '-4em', fontSize: "12px" }}>
                Already have an account?
              </p>
              <button
                className="forget-btn"
                style={{ padding: 0, marginTop: "-0.2rem" }}
                onClick={() => navigate("../login")}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
