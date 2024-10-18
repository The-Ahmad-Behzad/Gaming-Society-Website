import React from "react";
import { useForm } from "react-hook-form";
import { addDoc, collection } from "firebase/firestore";
import Navbar from "../components/Navbar";
import "../css/form.css";
import "../css/reportIssueOrQuery.css";
import { userSnap, displayName } from "../auth/Auth";
import { db, auth } from "../auth/Auth";
import PageNotFound from "./PageNotFound";
import { useState, useEffect } from "react";

const ReportIssueOrQuery = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: "",
            description: "",
        }
    });
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

    const submitForm = async (data) => {
        try {
            const senderEmail = userSnap.email;
            const senderName = displayName;

            await addDoc(collection(db, "issue"), {
                title: data.title,
                description: data.description,
                senderEmail: senderEmail,
                senderName: senderName,
                addressed: false,
                discarded: false,
            });
            alert("Issue reported successfully!");
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return ((!isAuthorized)? <PageNotFound/>:
        <>
            <Navbar />
            <h2 className="section-heading">Report an Issue or Query</h2>
            <form style={{ marginTop: "1em" }} className="card" onSubmit={handleSubmit(submitForm)}>
                <div className="field">
                    <label>Title</label>
                    <input {...register("title", { required: "This field is required" })} placeholder="Enter issue title" />
                    <p>{errors.title?.message}</p>
                </div>
                <div className="field">
                    <label>Description</label>
                    <textarea {...register("description", { required: "This field is required" })} placeholder="Enter issue description" />
                    <p>{errors.description?.message}</p>
                </div>
                <input style={{ textAlign: "center" }} type="submit" className="loginButton" value="Submit" />
            </form>
        </>
    );
};

export default ReportIssueOrQuery;
