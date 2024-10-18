import {
    addDoc,
    serverTimestamp
    } from "firebase/firestore"
import {
    db
    } from "../auth/Auth"

export default async function Create(attributes, collectionName) {
    try {
        const docRef = await addDoc(
            collection(db, collectionName), 
            attributes);
        console.log(`${collectionName} written with ID: ${docRef.id}`);
        } catch (e) {
        console.error("Error adding document: ", e);
        }
          
}