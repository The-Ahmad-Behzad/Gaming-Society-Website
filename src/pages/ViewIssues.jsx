import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import Navbar from "../components/Navbar";
import "../css/form.css";
import "../css/viewIssues.css";
import { db, auth, isMentor, isPresident } from "../auth/Auth";
import PageNotFound from "./PageNotFound";

async function getIssuesFromDB() {
    const querySnapshot = await getDocs(collection(db, "issue"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const ViewIssues = () => {
    const [issues, setIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
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
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        const issues = await getIssuesFromDB();
        setIssues(issues);
    };

    const viewDetails = (issue) => {
        setSelectedIssue(issue);
    };

    const closeOverlay = () => {
        setSelectedIssue(null);
    };

    return ((!isAuthorized)? <PageNotFound/>:
        <>
            <Navbar />
            <div className="center-content section-heading">
                <h3 className="cover-heading" style={{ color: "white", fontWeight: "bolder", letterSpacing: "1px", paddingTop: "6rem", }}>
                    Issues List
                </h3>
            </div>
            {issues.length === 0 ? (
                <div className="center-content">
                    <h2>Oops! No Issues Yet</h2>
                </div>
            ) : (
                <div className="grid-container">
                    {issues.map(issue => (
                        <div className="notification-container" key={issue.id}>
                            <div className="notification-content center-content">
                                <h3 className="cover-heading">
                                    <strong>{issue.title}</strong>
                                </h3>
                                <p className="normal-text">Description: {issue.description}</p>
                                <p className="normal-text">Reported by: {issue.senderName}</p>
                                <p className="normal-text">Email: {issue.senderEmail}</p>
                                <button className="loginButton3" onClick={() => viewDetails(issue)}>
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {selectedIssue && (
                <div className="overlay">
                    <div className="overlay-content card">
                        <h2 className="section-heading issue-card">Issue Details</h2>
                        <div className="participant-details">
                            <p><span>Title:</span> {selectedIssue.title}</p>
                            <p><span>Description:</span> {selectedIssue.description}</p>
                            <p><span>Reported by:</span> {selectedIssue.senderName}</p>
                            <p><span>Email:</span> {selectedIssue.senderEmail}</p>
                        </div>
                        <button className="close-button" onClick={closeOverlay}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ViewIssues;
