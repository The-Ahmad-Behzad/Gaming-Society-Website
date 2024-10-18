import React, { useEffect, useState } from "react";
import Carousel from "./Carousel";
import { useNavigate } from "react-router-dom";
import "../css/eventCarousel.css";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../auth/Auth";

async function getEventsFromDB() {
    const querySnapshot = await getDocs(collection(db, "event"));
    return querySnapshot.docs.map(doc => doc.data());
}

export default function EventCarousel() {
    const [slides, setSlides] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSlides() {
            const events = await getEventsFromDB();
            const approvedEvents = events.filter(event => (event.approved === true));
            const allSlides = approvedEvents.map(event => (
                <div className="center-content card" key={event.eventName}>
                    <img className="cover-img" src={event.imageUrl} alt={event.eventName} />
                    <h3 className="cover-heading" style={{ color: "#fcf4fc" }}>
                        <strong>{event.eventName}</strong>
                    </h3>
                    <p className="normal-text">{event.eventDescription}</p>
                    <button className="loginButton" onClick={() => navigate("/register-for-event", { state: { eventName: event.eventName } })}>
                        Register
                    </button>
                </div>
            ));
            setSlides(allSlides);
        }

        fetchSlides();
    }, [navigate]);

    return <Carousel heading="EVENTS" slides={slides} />;
}
