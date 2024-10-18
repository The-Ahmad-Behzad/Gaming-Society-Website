export default async function Fetch(collectionName) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot;
}