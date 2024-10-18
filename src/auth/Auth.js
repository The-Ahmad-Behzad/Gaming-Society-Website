import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA-2McLrfovQAgX5p7F0MJ5OQo4a3g8x7E",
  authDomain: "fast-gaming-club.firebaseapp.com",
  projectId: "fast-gaming-club",
  storageBucket: "fast-gaming-club.appspot.com",
};

async function getUser(uid) {
  const docRef = doc(db, "roles", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log(docSnap.data());
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

async function addRole(data) {
  try {
      const docRef = await setDoc(doc(db, "roles", data.uid), {
          role: data.role,
          uid: data.uid,
          email: data.email,
        });
      console.log("Document written with ID: ", docRef.id);
      } catch (e) {
      console.error("Error adding document: ", e);
      }
        
}


// let userSnap = { email: "", role: "", uid: "" };
// let displayName = "User";
// let user = {};
// let emptyUser = { email: "", displayName: "", uid: "" };

// onAuthStateChanged(auth, async (User) => {
//   if (User) {
// //    addRole({uid: User.uid, role:"non-member", email: User.email})
//     userSnap = await getUser(User.uid); // Wait for the Promise to resolve
//     user = User;
//     displayName = User.displayName;
//     console.log("Hello", userSnap.role, displayName);
//     console.log("Logged In",user)
//   } else {
//     userSnap = await getUser("E7jSd3ibohJYd7wILmde");
//     displayName = "User";
//     user = null;
//     console.log("Logged Out",user)
//   }
// });


// function isLoggedIn(){
//   return (user !== null);
// }

let user = null; // Start with null to indicate no user is logged in initially
let userSnap = { email: "", role: "", uid: "" };
let displayName = "User";

onAuthStateChanged(auth, async (User) => {
  if (User) {
    userSnap = await getUser(User.uid); // Wait for the Promise to resolve
    user = User;
    displayName = User.displayName;
    console.log("Hello", userSnap.role, displayName);
    console.log("Logged In", user);
  } else {
    userSnap = { email: "", role: "", uid: "" };
    displayName = "User";
    user = null; // Explicitly set to null when logged out
    console.log("Logged Out", user);
  }
});

function isLoggedIn() {
  return user !== null;
}

function isMember(){
  return (isLoggedIn() && (userSnap.role == "member"))
}
function isHead(){
  return (isLoggedIn() && (userSnap.role == "head"))
}
function isPresident(){
  return (isLoggedIn() && (userSnap.role == "president"))
}
function isMentor(){
  return (isLoggedIn() && (userSnap.role == "mentor"))
}
function isNonMemberUser() {
  return (isLoggedIn() && (!isMember() && !isHead() && !isPresident() && !isMentor()))
}


export { storage, app, auth, provider, db, userSnap, user, displayName, addRole, isHead, isLoggedIn, isMentor, isMember, isPresident, isNonMemberUser };
