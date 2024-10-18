import { useForm, SubmitHandler } from "react-hook-form"
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/form.css"
import { 
  addDoc,
  collection } from "firebase/firestore";
import BgImage from "../assets/bg/bg-circuit.webp"
import { db, auth } from "../auth/Auth";
import PageNotFound from "./PageNotFound";
import { useState, useEffect } from "react";


export default function RegisterForEvent() {

    const location = useLocation()
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

    const {
        register,
        handleSubmit,
        // watch,
        formState: {errors}
      } = useForm({
        defaultValues: {
          teamName: "",
          email: "",
          contactNo: "",
          file: {}
        }
      });
      
      async function sumbitForm(data) {
        try {
            // with user named ID: (overwrites if exists)
            // await setDoc(doc(db, "posts", "post01"), {
            //     body: postBody
            //   });
    
            // with auto gen ID
            const docRef = await addDoc(collection(db, "participant"), {
                teamName: data.teamName,
                email: data.email,
                phoneNo: data.contactNo,
                eventName: location.state.eventName,
                // paymentProof: data.paymentProof,
            });
            console.log("Document written with ID: ", docRef.id);
            } catch (e) {
            console.error("Error adding document: ", e);
            }
              
    }

    return ((!isAuthorized)? <PageNotFound/>:
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
    <h2 className="section-heading">{ location.state.eventName } Registration </h2>
    <form style={{marginTop: "1em"}} className="card" onSubmit={handleSubmit((data) => {
      sumbitForm(data)
      })}>
        <div className="field">
        <label>Team Name</label>
      <input {...register(
          "teamName", 
          {required: "This field is required",
           minLength: {value: 3, message: "Team/Player name must have atleast 3 characters"}})}
          placeholder="eg: Crimson Reds"/>
      <p>{errors.teamName?.message}</p>
        </div>
        <div className="field">
      <label>Email</label>
      <input {...register("email", {required: "This field is required"})} placeholder="eg: alex136@gmail.com" type="email"/>
      <p>{errors.email?.message}</p>
      </div>
      <div className="field">
      <label>Contact No</label>
      <input {...register("contactNo", {required: "This field is required"})} placeholder="eg: +923001234567" type="tel"/>
      <p>{errors.contactNo?.message}</p>
      </div>
      <div className="field">
      <label>Proof of Payment</label>
      <input {...register("file"/*, {required: "This field is required"}*/)} type="file" style={{fontSize:"x-small", justifyContent: "center"}}/>
      {/* <p>{errors.contactNo?.message}</p> */}
      </div>

      {/* <input {...register("password", {required: "This field is required"})} type="password" placeholder='Password' /> */}
      <input style={{textAlign:"center"}} type="submit" className="loginButton"/>
    </form>
    </div>
  )
}