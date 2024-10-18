import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import EventCarousel from "../components/EventCarousel";
import ImgHome from "../assets/bg/bg-skull.webp"; // Import the background image

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import BackgroundVideo from "../components/BackgroundVideo";

export default function Home() {
    
    const navigate = useNavigate()

    return (
      <>
        <div>
            <Navbar/>
            <div>
              <BackgroundVideo/>
            </div>
          <div 
          style={{
              paddingTop: "3rem",
              paddingLeft: "5rem",
              marginTop: "7rem",
              backgroundImage: `url(${ImgHome})`,
              backgroundSize: "cover", // Ensures the image covers the entire area
              backgroundPosition: "center", // Centers the image within the div
              backgroundAttachment: "scroll", // Keeps the image in place while scrolling
              minHeight: "100vh", // Ensures the div takes up the full viewport height
              backgroundRepeat: "no-repeat" // Prevents the image from repeating
            }}
          >
            <EventCarousel/>
          </div>
        </div>
      </>      
    )
}
