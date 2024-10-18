import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db, isHead, isMentor, isPresident, auth} from "../auth/Auth";
import Navbar from "../components/Navbar";
import "../css/form.css";
import "../css/assignTaskToMember.css";
import BgImage from "../assets/bg/bg-circuit.webp";
import PageNotFound from "./PageNotFound";

async function getTasksFromDB() {
    const querySnapshot = await getDocs(collection(db, "teamTask"));
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            deadline: data.deadline ? data.deadline.toDate().toLocaleDateString("en-PK") : "No deadline"
        };
    });
}

async function getMembersFromDB(team) {
    const rolesSnapshot = await getDocs(collection(db, "roles"));
    const membersSnapshot = await getDocs(collection(db, "member"));

    const membersWithRoles = membersSnapshot.docs.map(memberDoc => {
        const memberData = memberDoc.data();
        const roleData = rolesSnapshot.docs.find(roleDoc => roleDoc.data().uid === memberData.uid)?.data();
        return { ...memberData, ...roleData };
    });

    return membersWithRoles.filter(member => member.team === team.toLowerCase());
}

const AssignTaskToMember = () => {
    const [tasks, setTasks] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedTask, setSelectedTask] = useState("");
    const [selectedTaskDetails, setSelectedTaskDetails] = useState(null); // For overlay
    const [selectedTeam, setSelectedTeam] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (isHead()) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, []);

    const [tab, setTab] = useState("unassigned"); // Added state for managing tabs

    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        if (selectedTeam) {
            fetchMembers(selectedTeam);
        }
    }, [selectedTeam]);

    const fetchTasks = async () => {
        const tasks = await getTasksFromDB();
        setTasks(tasks);
    };

    const fetchMembers = async (team) => {
        const members = await getMembersFromDB(team);
        setMembers(members);
    };

    const submitForm = async (data) => {
        try {
            const selectedMember = members.find(member => member.uid === data.assignedToMember);
            await updateDoc(doc(db, "teamTask", selectedTaskDetails.id), {
                assignedToMember: {
                    mid: selectedMember.uid,
                    mFirstName: selectedMember.firstName,
                    mLastName: selectedMember.lastName
                },
                isAssignedToMember: true,
            });
            alert(`Task ${selectedTaskDetails.name} assigned to ${selectedMember.firstName} ${selectedMember.lastName} successfully!`);
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };

    const viewTaskDetails = (task) => {
        setSelectedTeam(task.assignedToTeam);
        setSelectedTaskDetails(task);

        //Set the default value for the select field if a member is already assigned
        if (task.assignedToMember) {
            setValue("assignedToMember", task.assignedToMember.mid);
        } else {
            setValue("assignedToMember", ""); // Clear selection if no member is assigned
        }
    };

    const closeOverlay = () => {
        setSelectedTaskDetails(null);
    };

    const filteredTasks = tasks.filter(task => 
        tab === "assigned" ? task.isAssignedToMember : !task.isAssignedToMember
    );

    return ((!isAuthorized)? <PageNotFound/>:
        <div
          style={{
            paddingTop: "6rem",
            backgroundImage: `url(${BgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "scroll",
            minHeight: "100vh",
            backgroundRepeat: "no-repeat"
          }}
        >
            <Navbar />
            <h2 className="section-heading" style={{paddingBottom: "3rem"}}>Task Assignments</h2>
            {/* Tabs for Assigned and Unassigned Tasks */}
            <div className="tabs">
                <button
                    className={`tab-button ${tab === "unassigned" ? "active" : ""}`}
                    onClick={() => setTab("unassigned")}
                >
                    Unassigned Tasks
                </button>
                <button
                    className={`tab-button ${tab === "assigned" ? "active" : ""}`}
                    onClick={() => setTab("assigned")}
                >
                    Assigned Tasks
                </button>
            </div>
            <div className="grid-container">
                {filteredTasks.map(task => (
                    <div className="notification-container" key={task.id}>
                        <div className="notification-content center-content">
                            <h3 className="cover-heading">
                                <strong>{task.name}</strong>
                            </h3>
                            <p className="normal-text">Description: {task.description}</p>
                            <p className="normal-text">Team Assigned To: {task.assignedToTeam}</p>
                            <p className="normal-text">Deadline: {task.deadline}</p>
                            <button className="loginButton3" onClick={() => viewTaskDetails(task)}>
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {/* Overlay for Task Details */}
            {selectedTaskDetails && (
                <div className="overlay">
                    <div className="overlay-content card">
                        <h2 className="section-heading issue-card">Task Details</h2>
                        <div className="issue-details">
                            <p><span>Name:</span> {selectedTaskDetails.name}</p>
                            <p><span>Description:</span> {selectedTaskDetails.description}</p>
                            <p><span>Team Assigned To:</span> {selectedTaskDetails.assignedToTeam}</p>
                            <p><span>Deadline:</span> {selectedTaskDetails.deadline}</p>
                            <div className="field">
                                <label>Assign to Member</label>
                                <br />
                                <select
                                  style={{ marginLeft: ".3rem", marginTop: ".3em" }}
                                  {...register("assignedToMember", { required: "This field is required" })}
                                  defaultValue={selectedTaskDetails.assignedToMember?.mid || ""}
                                >
                                    <option value="">Select a member</option>
                                    {members.map(member => (
                                        <option key={member.uid} value={member.uid}>
                                            {member.firstName} {member.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button className="loginButton2" onClick={handleSubmit(submitForm)}>Assign Task</button>
                        </div>
                        <button className="close-button" onClick={closeOverlay}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignTaskToMember;