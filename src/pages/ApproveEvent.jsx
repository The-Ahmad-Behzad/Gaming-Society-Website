import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db, isMentor, isPresident, auth } from "../auth/Auth";
import { useForm } from "react-hook-form";
import ScrollableList from "../components/ScrollableList";
import Navbar from "../components/Navbar";
import "../css/form.css";
import "../css/approveEvent.css";
import PageNotFound from "./PageNotFound";

async function getEventsFromDB() {
    const querySnapshot = await getDocs(collection(db, "event"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const ApproveEvent = () => {
    const [slides, setSlides] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const navigate = useNavigate();

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


    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        fetchSlides();
    }, [navigate]);

    const fetchSlides = async () => {
        const events = await getEventsFromDB();
        const unapprovedEvents = events.filter(event => (event.approved === false && event.rejected === false));

        if (unapprovedEvents.length === 0) {
            setSlides([]); // Set slides to an empty array
        } else {
            const allSlides = unapprovedEvents.map(event => (
                <div className="notification-container" key={event.id}>
                    <img className="notification-img" src={event.imageUrl} alt={event.eventName} />
                    <div className="notification-content">
                        <div className="title-edit-container">
                            <h3 className="cover-heading">
                                <strong>{event.eventName}</strong>
                            </h3>
                            <button className="loginButton3" onClick={() => editAndApprove(event)}>
                                Edit
                            </button>
                        </div>
                        <p className="normal-text">{event.eventDescription}</p>
                        <div className="horizontal-container">
                            <button className="loginButton2" onClick={() => approveEvent(event.id)}>
                                Approve
                            </button>
                            <button className="loginButton" onClick={() => rejectEvent(event.id)}>
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            ));
            setSlides(allSlides);
        }
    }

    const editAndApprove = (event) => {
        setSelectedEvent(event);
        Object.keys(event).forEach(key => {
            setValue(key, event[key]);
        });
    };

    const closeOverlay = () => {
        setSelectedEvent(null);
    };

    const onSubmit = async (data) => {
        try {
            const eventRef = doc(db, "event", selectedEvent.id);
            await updateDoc(eventRef, {
                ...data,
                approved: true
            });
            closeOverlay();
            fetchSlides();
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };

    const approveEvent = async (eventId) => {
        try {
            const eventRef = doc(db, "event", eventId);
            await updateDoc(eventRef, {
                approved: true,
                rejected: false
            });
            fetchSlides();
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };

    const rejectEvent = async (eventId) => {
        try {
            const eventRef = doc(db, "event", eventId);
            await updateDoc(eventRef, {
                approved: false,
                rejected: true
            });
            fetchSlides();
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };

    return ((!isAuthorized)? <PageNotFound/>:
        <>
            <Navbar />
            <div className="center-content section-heading" >
                <h3 className="cover-heading" style={{ color: "white", fontWeight: "bolder", letterSpacing: "1px" }}>
                    Event Requests
                </h3>
            </div>
            {slides.length === 0 ? (
                <div className="center-content">
                    <h2>Oops! No Requests Yet</h2>
                </div>
            ) : (
                <ScrollableList elements={slides} />
            )}
            {selectedEvent && (
                <div className="overlay">
                    <div className="overlay-content">
                        <h2 className="section-heading">Edit Event</h2>
                        <form style={{ marginTop: "1em" }} className="card" onSubmit={handleSubmit(onSubmit)}>
                            <div className="field">
                                <label>Event Name</label>
                                <input {...register("eventName", { required: "This field is required", minLength: { value: 5, message: "" } })} placeholder="eg: Tekken 8 Tournament" />
                                <p>{errors.eventName?.message}</p>
                            </div>
                            <div className="field">
                                <label>Event Description</label>
                                <textarea rows="4" cols="50" {...register("eventDescription", { required: "This field is required", minLength: { value: 5, message: "" } })} placeholder="eg: Unleash your skills and get a chance to win exciting prizes" />
                                <p>{errors.eventDescription?.message}</p>
                            </div>
                            <div className="field">
                                <label>Registration Start</label>
                                <input style={{ fontSize: "small" }} {...register("registrationStart", { required: "This field is required" })} type="date" />
                                <p>{errors.registrationStart?.message}</p>
                            </div>
                            <div className="field">
                                <label>Registration End</label>
                                <input style={{ fontSize: "small" }} {...register("registrationEnd", { required: "This field is required" })} type="date" />
                                <p>{errors.registrationEnd?.message}</p>
                            </div>
                            <div className="field">
                                <label>Event Start</label>
                                <input style={{ fontSize: "small" }} {...register("eventStart", { required: "This field is required" })} type="date" />
                                <p>{errors.eventStart?.message}</p>
                            </div>
                            <div className="field">
                                <label>Event End</label>
                                <input style={{ fontSize: "small" }} {...register("eventEnd", { required: "This field is required" })} type="date" />
                                <p>{errors.eventEnd?.message}</p>
                            </div>
                            <div className="field">
                                <label>Min Participants</label>
                                <input {...register("minParticipants", { required: "This field is required" })} placeholder="eg: 2" type="number" />
                                <p>{errors.minParticipants?.message}</p>
                            </div>
                            <div className="field">
                                <label>Max Participants</label>
                                <input {...register("maxParticipants", { required: "This field is required" })} placeholder="eg: 10" type="number" />
                                <p>{errors.maxParticipants?.message}</p>
                            </div>
                            <div className="field">
                                <label>Entry Fee</label>
                                <input {...register("entryFee", { required: "This field is required" })} placeholder="eg: 1200" type="number" />
                                <p>{errors.entryFee?.message}</p>
                            </div>
                            <div className="field">
                                <label>Cover Image Link</label>
                                <input {...register("imageUrl", { required: "This field is required" })} placeholder="eg: www.google.com/image1.jpeg" type="text" />
                                <p>{errors.imageUrl?.message}</p>
                            </div>
                            <div className="horizontal-container">
                                <input type="submit" className="loginButton2" value="Approve" style={{minWidth: "auto"}} />
                                <button className="loginButton" type="button" style={{minWidth: "auto", height: "auto"}} onClick={() => rejectEvent(selectedEvent.id)}>Reject</button>
                            </div>
                        </form>
                        <button className="close-button" onClick={closeOverlay}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ApproveEvent;
