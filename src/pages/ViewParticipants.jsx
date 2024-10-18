import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import Navbar from "../components/Navbar";
import "../css/form.css";
import "../css/viewParticipants.css";
import { db, auth, isMentor, isPresident } from "../auth/Auth";
import PageNotFound from "./PageNotFound";

async function getParticipantsFromDB() {
    const querySnapshot = await getDocs(collection(db, "participant"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const ViewParticipants = () => {
    const [participants, setParticipants] = useState([]);
    const [filteredParticipants, setFilteredParticipants] = useState([]);
    const [events, setEvents] = useState(["All"]);
    const [selectedEvent, setSelectedEvent] = useState("All");
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (isMentor() || isPresident()) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, []);

    useEffect(() => {
        fetchParticipants();
    }, []);

    const fetchParticipants = async () => {
        const participants = await getParticipantsFromDB();
        const eventNames = ["All"];
        participants.forEach(participant => {
            const eventName = participant.eventName.replace(" Tournament", "");
            if (!eventNames.includes(eventName)) {
                eventNames.push(eventName);
            }
        });
        setParticipants(participants);
        setEvents(eventNames);
        setFilteredParticipants(participants);
    };

    const filterByEvent = (event) => {
        setSelectedEvent(event);
        if (event === "All") {
            setFilteredParticipants(participants);
        } else {
            const filtered = participants.filter(participant => participant.eventName.replace(" Tournament", "") === event);
            setFilteredParticipants(filtered);
        }
    };

    const viewDetails = (participant) => {
        setSelectedParticipant(participant);
    };

    const closeOverlay = () => {
        setSelectedParticipant(null);
    };

    return ((!isAuthorized)? <PageNotFound/>:
        <>
            <Navbar />
            <div className="center-content section-heading">
                <h3 className="cover-heading" style={{ color: "white", fontWeight: "bolder", letterSpacing: "1px", paddingTop: "6rem", }}>
                    Participant List
                </h3>
            </div>
            <div className="tabs">
                {events.map(event => (
                    <button
                        key={event}
                        className={`tab-button ${selectedEvent === event ? "active" : ""}`}
                        onClick={() => filterByEvent(event)}
                    >
                        {event}
                    </button>
                ))}
            </div>
            {filteredParticipants.length === 0 ? (
                <div className="center-content">
                    <h2>Oops! No Participants Yet</h2>
                </div>
            ) : (
                <div className="grid-container">
                    {filteredParticipants.map(participant => (
                        <div className="notification-container" key={participant.id}>
                            <div className="notification-content center-content">
                                <h3 className="cover-heading">
                                    <strong>{participant.teamName}</strong>
                                </h3>
                                <p className="normal-text">Event: {participant.eventName}</p>
                                <p className="normal-text">Email: {participant.email}</p>
                                <p className="normal-text">Phone No: {participant.phoneNo}</p>
                                <button className="loginButton3" onClick={() => viewDetails(participant)}>
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {selectedParticipant && (
                <div className="overlay">
                    <div className="overlay-content card">
                        <h2 className="section-heading participant-card">Participant Details</h2>
                        <div className="participant-details">
                            <p><span>Team Name:</span> {selectedParticipant.teamName}</p>
                            <p><span>Event:</span> {selectedParticipant.eventName}</p>
                            <p><span>Email:</span> {selectedParticipant.email}</p>
                            <p><span>Phone No:</span> {selectedParticipant.phoneNo}</p>
                        </div>
                        <button className="close-button" onClick={closeOverlay}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ViewParticipants;
