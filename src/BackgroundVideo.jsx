// BackgroundVideo.js
import React from 'react';
import BackgroundVideoPlayer from 'react-background-video-player';
import '../css/backgroundVideo.css'; // For styling
import BgVideo from "../assets/video/bgVideo3.mp4"


const BackgroundVideo = () => {
  return (
    <div className="background-video-container">
      <video src={BgVideo} autoPlay loop muted className="background-video" />
       <div className="content" >
        <h2>Welcome to </h2>
        <h1>Fast Gaming Club</h1>
        <h4>The Ultimate Gaming Experience!</h4>
      </div>
    </div>
  );
};

export default BackgroundVideo;
