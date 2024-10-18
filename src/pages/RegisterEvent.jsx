import { useForm, SubmitHandler } from "react-hook-form"
import Navbar from "../components/Navbar";
import "../css/form.css"
import { 
  addDoc,
  collection } from "firebase/firestore";
import BgImage from "../assets/bg/bg-circuit.webp"
import { db, isMentor, isPresident, isHead, isMember, auth } from "../auth/Auth";
import { useState, useEffect } from "react";
import PageNotFound from "./PageNotFound";



export default function RegisterEvent() {

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (isMentor() || isPresident() || isHead() || isMember()) {
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
          eventName: "",
          eventDescription: "",
          registrationStart: "",         
          registrationEnd: "",         
          eventStart: "",         
          eventEnd: "",
          minParticipants: "",       
          maxParticipants: "",
          entryFee: "",       
        }
      });
      
      async function sumbitForm(data) {
        try {
            // with user named ID: (overwrites if exists)
            // await setDoc(doc(db, "posts", "post01"), {
            //     body: postBody
            //   });
    
            // with auto gen ID
            const docRef = await addDoc(collection(db, "event"), {
                eventName: data.eventName,
                eventDescription: data.eventDescription,
                registrationStart: data.registrationStart,
                registrationEnd: data.registrationEnd,       
                eventStart: data.eventStart,    
                eventEnd: data.eventEnd,
                minParticipants: data.minParticipants,       
                maxParticipants: data.maxParticipants,
                entryFee: data.entryFee,
                imageUrl: data.imageUrl,
                approved: false,
                rejected: false,
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
    <h2 className="section-heading">Event Registration</h2>
    <form style={{marginTop: "1em"}} className="card" onSubmit={handleSubmit((data) => {
      sumbitForm(data)
      })}>
        <div className="field">
        <label>Event Name</label>
      <input {...register(
          "eventName", 
          {required: "This field is required",
           minLength: {value: 5, message: ""}})}
          placeholder="eg: Tekken 8 Tournament"/>
      <p>{errors.eventName?.message}</p>
        </div>
        <div className="field">
        <label>Event Description</label>
        <textarea rows="4" cols="50" {...register(
          "eventDescription", 
          {required: "This field is required",
           minLength: {value: 5, message: ""}})}
          placeholder="eg: Unleash your skills and get a chance to win exciting prizes"/>
      <p>{errors.eventDescription?.message}</p>
        </div>

        <div className="field">
      <label>Registration Start</label>
      <input style={{fontSize: "small"}} {...register("registrationStart", {required: "This field is required"})} type="date"/>
      <p>{errors.registrationStart?.message}</p>
      </div>
      <div className="field">
      <label>Registration End</label>
      <input style={{fontSize: "small"}} {...register("registrationEnd", {required: "This field is required"})} type="date"/>
      <p>{errors.registrationEnd?.message}</p>
      </div>
      <div className="field">
      <label>Event Start</label>
      <input style={{fontSize: "small"}} {...register("eventStart", {required: "This field is required"})} type="date"/>
      <p>{errors.eventStart?.message}</p>
      </div>
      <div className="field">
      <label>Event End</label>
      <input style={{fontSize: "small"}} {...register("eventEnd", {required: "This field is required"})} type="date"/>
      <p>{errors.eventEnd?.message}</p>
      </div>

      <div className="field">
      <label>Min Participants</label>
      <input {...register("minParticipants", {required: "This field is required"})} placeholder="eg: 2" type="number"/>
      <p>{errors.minParticipants?.message}</p>
      </div>
      <div className="field">
      <label>Max Participants</label>
      <input {...register("maxParticipants", {required: "This field is required"})} placeholder="eg: 10" type="number"/>
      <p>{errors.maxParticipants?.message}</p>
      </div>
      <div className="field">
      <label>Entry Fee</label>
      <input {...register("entryFee", {required: "This field is required"})} placeholder="eg: 1200" type="number"/>
      <p>{errors.entryFee?.message}</p>
      </div>

      <div className="field">
      <label>Cover Image Link</label>
      <input {...register("imageUrl", {required: "This field is required"})} placeholder="eg: www.google.com/image1.jpeg" type="text"/>
      <p>{errors.imageUrl?.message}</p>
      </div>

      {/* <input {...register("password", {required: "This field is required"})} type="password" placeholder='Password' /> */}
      <input style={{textAlign:"center"}} type="submit" className="loginButton"/>
    </form>
    </div>
  )
}