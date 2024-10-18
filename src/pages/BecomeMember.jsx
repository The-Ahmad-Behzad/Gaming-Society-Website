import { useForm, SubmitHandler } from "react-hook-form"
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { db, isNonMemberUser, auth } from "../auth/Auth";
import { user } from "../auth/Auth";
import { useState, useEffect } from "react";
import "../css/form.css"
import { addDoc, collection } from "firebase/firestore";
import BgImage from "../assets/bg/bg-circuit.webp"
import PageNotFound from "./PageNotFound";



export default function BecomeMember() {

    const location = useLocation()
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (isNonMemberUser()) {
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
        watch,
        formState: {errors}
      } = useForm({
        defaultValues: {
          firstName: "",
          lastName: "",
          contactNo: "",
          role: "",
          team: "",
          relevantExperience: "",
        }
      });

      const [isTeamDisabled, setIsTeamDisabled] = useState(false);
      const [teamOptions, setTeamOptions] = useState(["media", "marketing", "operations"]);
      
      const selectedRole = watch("role");

      useEffect(() => {
        if (selectedRole === "president") {
          setIsTeamDisabled(true);
          setTeamOptions(["lead"]);
        } else {
          setIsTeamDisabled(false);
          setTeamOptions(["media", "marketing", "operations"]);
        }
      }, [selectedRole]);

      async function sumbitForm(data) {
        try {
            const docRef = await addDoc(collection(db, "member"), {
                firstName: data.firstName,
                lastName: data.lastName,
                email: user.email,
                phoneNo: data.contactNo,
                role: data.role,
                team: data.team,
                relevantExperience: data.relevantExperience,
                uid: user.uid,
                approved: false,
                rejected: false,
            });
            console.log("Document written with ID: ", docRef.id);
            alert("Member Application sumbitted successfully!");
            } catch (e) {
            console.error("Error adding document: ", e);
            }
              
    }

    return (!isAuthorized? <PageNotFound/>:
      <>
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
        <Navbar/>
      <h2 className="section-heading">Member Registration Form</h2>
      <form style={{marginTop: "1em"}} className="card" onSubmit={handleSubmit((data) => {
        sumbitForm(data)
        })}>
          <div className="field">
          <label>First Name</label>
        <input {...register(
            "firstName", 
            {required: "This field is required",
            minLength: {value: 3, message: "First name must have atleast 3 characters"}})}
            placeholder="eg: Cathy"/>
        <p>{errors.firstName?.message}</p>
          </div>
          <div className="field">
          <label>Last Name</label>
        <input {...register(
            "lastName", 
            {required: "This field is required",
            minLength: {value: 3, message: "Last name must have atleast 3 characters"}})}
            placeholder="eg: Deadson"/>
        <p>{errors.lastName?.message}</p>
          </div>
        <div className="field">
        <label>Contact No</label>
        <input {...register("contactNo", {required: "This field is required"})} placeholder="eg: +923001234567" type="tel"/>
        <p>{errors.contactNo?.message}</p>
        </div>
        <div className="field">
        <label>Position</label>
        <br />
        <select style={{marginLeft: ".3rem", marginTop: ".3em"}} name="role" id="role" {...register("role", {required: "This field is required"})}>
          <option value="president">President</option>
          <option value="head">Head</option>
          <option value="member">Member</option>
        </select>
        <p>{errors.role?.message}</p>
        </div>
        <div className="field">
        <label>Team</label>
        <br />
        <select style={{marginLeft: ".3rem", marginTop: ".3em"}} name="team" id="team" {...register("team", {required: "This field is required"})} disabled={isTeamDisabled}>
          {teamOptions.map((option) => (
            <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
          ))}
        </select>
        <p>{errors.team?.message}</p>
        </div>
        <div className="field">
          <label>Relevant Experience</label>
          <textarea rows="4" cols="50" {...register("relevantExperience")}
            placeholder="Enter your relevent experience"/>
        <p>{errors.relevantExperience?.message}</p>
          </div>
      <input style={{textAlign:"center"}} type="submit" className="loginButton"/>
      </form>
    </div>
    </>
  )
}
