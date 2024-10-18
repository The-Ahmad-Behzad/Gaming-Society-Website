import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { db, isMentor, isPresident, auth } from "../auth/Auth";
import Navbar from "../components/Navbar";
import "../css/form.css";
import "../css/assignTaskToTeam.css";
import BgImage from "../assets/bg/bg-circuit.webp"
import PageNotFound from "./PageNotFound";

async function getTeamsFromDB() {
    const querySnapshot = await getDocs(collection(db, "team"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const AssignTaskToTeam = () => {
    const [teams, setTeams] = useState([]);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            description: "",
            assignedToTeam: "",
            deadline: ""
        }
    });
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (isPresident() || isMentor()) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, []);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        const teams = await getTeamsFromDB();
        setTeams(teams);
    };

    const submitForm = async (data) => {
        try {
            await addDoc(collection(db, "teamTask"), {
                name: data.name,
                description: data.description,
                assignedToTeam: data.assignedToTeam,
                assignedToMember: {},
                isAssignedToMember: false,
                deadline: data.deadline ? new Date(data.deadline) : null,
            });
            alert("Task assigned successfully!");
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

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
            <Navbar />
            <h2 className="section-heading">Assign Task to Team</h2>
            <form style={{ marginTop: "1em" }} className="card" onSubmit={handleSubmit(submitForm)}>
                <div className="field">
                    <label>Task Name</label>
                    <input {...register("name", { required: "This field is required" })} placeholder="Enter task name" />
                    <p>{errors.name?.message}</p>
                </div>
                <div className="field">
                    <label>Description</label>
                    <textarea {...register("description", { required: "This field is required" })} placeholder="Enter task description" />
                    <p>{errors.description?.message}</p>
                </div>
                <div className="field">
                    <label>Assign to Team</label>
                    <br />
                    <select style={{marginLeft: ".3rem", marginTop: ".3em"}} {...register("assignedToTeam", { required: "This field is required" })}>
                        <option value="">Select a team</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.name}>{team.name}</option>
                        ))}
                    </select>
                    <p>{errors.assignedToTeam?.message}</p>
                </div>
                <div className="field">
                    <label>Deadline</label>
                    <input type="date" {...register("deadline", {
                        validate: value => !value || new Date(value) >= new Date() || "Deadline cannot be before the current date"
                    })} />
                    <p>{errors.deadline?.message}</p>
                </div>
                <input style={{ textAlign: "center" }} type="submit" className="loginButton" value="Assign Task" />
            </form>
        </div>
    );
};

export default AssignTaskToTeam;
