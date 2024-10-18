import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db, isMentor, isPresident, auth } from "../auth/Auth";
import { useForm } from "react-hook-form";
import ScrollableList from "../components/ScrollableList";
import Navbar from "../components/Navbar";
import "../css/form.css";
import "../css/approveMember.css"; // Adjust CSS file as needed
import PageNotFound from "./PageNotFound";

async function getMembersFromDB() {
    const querySnapshot = await getDocs(collection(db, "member"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}



const ApproveMember = () => {
    const [slides, setSlides] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
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
        const members = await getMembersFromDB();
        const unapprovedMembers = members.filter(member => (member.approved === false && member.rejected === false));

        if (unapprovedMembers.length === 0) {
            setSlides([]); // Set slides to an empty array
        } else {
            const allSlides = unapprovedMembers.map(member => (
                <div className="notification-container" key={member.id}>
                    <div className="notification-content">
                        <div className="title-edit-container">
                            <h3 className="cover-heading">
                                <strong>{member.firstName} {member.lastName}</strong>
                            </h3>
                            <button className="loginButton3" onClick={() => editAndApprove(member)}>
                                Edit
                            </button>
                        </div>
                        <p className="normal-text">{member.email}</p>
                        <p className="normal-text">{member.contactNo}</p>
                        <p className="normal-text">Role: {member.role}</p>
                        <p className="normal-text">Experience: {member.relevantExperience}</p>
                        <div className="horizontal-container">
                            <button className="loginButton2" onClick={() => approveMember(member.id)}>
                                Approve
                            </button>
                            <button className="loginButton" onClick={() => rejectMember(member.id)}>
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            ));
            setSlides(allSlides);
        }
    }

    const editAndApprove = (member) => {
        setSelectedMember(member);
        Object.keys(member).forEach(key => {
            setValue(key, member[key]);
        });
    };

    const closeOverlay = () => {
        setSelectedMember(null);
    };

    const onSubmit = async (data) => {
        try {
            const memberRef = doc(db, "member", selectedMember.id);
            await updateDoc(memberRef, {
                ...data,
                approved: true
            });
            closeOverlay();
            fetchSlides();
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };

    const approveMember = async (memberId) => {
        try {
            const memberRef = doc(db, "member", memberId);
            await updateDoc(memberRef, {
                approved: true,
                rejected: false
            });
            fetchSlides();
            closeOverlay();
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };

    const rejectMember = async (memberId) => {
        try {
            const memberRef = doc(db, "member", memberId);
            await updateDoc(memberRef, {
                approved: false,
                rejected: true
            });
            fetchSlides();
            closeOverlay();
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };

    return ((!isAuthorized)? <PageNotFound/>:
        <>
            <Navbar />
            <div className="center-content section-heading">
                <h3 className="cover-heading" style={{ color: "white", fontWeight: "bolder", letterSpacing: "1px" }}>
                    Member Requests
                </h3>
            </div>
            {slides.length === 0 ? (
                <div className="center-content">
                    <h2>Oops! No Requests Yet</h2>
                </div>
            ) : (
                <ScrollableList elements={slides} />
            )}
            {selectedMember && (
                <div className="overlay">
                    <div className="overlay-content">
                        <h2 className="section-heading">Edit Member</h2>
                        <form style={{ marginTop: "1em" }} className="card" onSubmit={handleSubmit(onSubmit)}>
                            <div className="field">
                                <label>First Name</label>
                                <input {...register("firstName", { required: "This field is required", minLength: { value: 3, message: "First name must have at least 3 characters" } })} placeholder="eg: Cathy" />
                                <p>{errors.firstName?.message}</p>
                            </div>
                            <div className="field">
                                <label>Last Name</label>
                                <input {...register("lastName", { required: "This field is required", minLength: { value: 3, message: "Last name must have at least 3 characters" } })} placeholder="eg: Deadson" />
                                <p>{errors.lastName?.message}</p>
                            </div>
                            <div className="field">
                                <label>Email</label>
                                <input {...register("email", { required: "This field is required" })} placeholder="eg: alex136@gmail.com" type="email" />
                                <p>{errors.email?.message}</p>
                            </div>
                            <div className="field">
                                <label>Contact No</label>
                                <input {...register("contactNo", { required: "This field is required" })} placeholder="eg: +923001234567" type="tel" />
                                <p>{errors.contactNo?.message}</p>
                            </div>
                            <div className="field">
                                <label>Role</label>
                                <select {...register("role", { required: "This field is required" })}>
                                    <option value="president">President</option>
                                    <option value="EC Member">EC Member</option>
                                    <option value="head">Head</option>
                                    <option value="member">Member</option>
                                </select>
                                <p>{errors.role?.message}</p>
                            </div>
                            <div className="field">
                                <label>Relevant Experience</label>
                                <textarea rows="4" cols="50" {...register("relevantExperience")} placeholder="Enter your relevant experience" />
                                <p>{errors.relevantExperience?.message}</p>
                            </div>
                            <div className="horizontal-container">
                                <input type="submit" className="loginButton2" style={{minWidth: "auto"}} value="Approve"  />
                                <button className="loginButton" type="button" style={{minWidth: "auto"}} onClick={() => rejectMember(selectedMember.id)}>Reject</button>
                            </div>
                        </form>
                        <button className="close-button" onClick={closeOverlay}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ApproveMember;
