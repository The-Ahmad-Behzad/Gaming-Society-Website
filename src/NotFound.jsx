import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/notFound.css'; 
import Navbar from './Navbar';
import BgImage from "../assets/bg/bg-not-found.jpg"

const NotFound = () => {

    const navigate = useNavigate();

    const goHome = () => {
        navigate("../");
    };

    return (
        <div
          style={{
            paddingTop: "6rem",
            backgroundImage: `url(${BgImage})`,
            backgroundSize: "cover", // Ensures the image covers the entire area
            backgroundPosition: "center", // Centers the image within the div
            backgroundAttachment: "scroll", // Keeps the image in place while scrolling
            minHeight: "100vh", // Ensures the div takes up the full viewport height
            backgroundRepeat: "no-repeat" // Prevents the image from repeating
          }}
        >
            <div className="not-found-container">
                <p className="not-found-message" style={{marginTop: "32rem"}}>Oops! The page you are looking for does not exist.</p>
                <button className="loginButton2" onClick={goHome}>Go to Homepage</button>
        </div>
        </div>
    );
};

export default NotFound;
