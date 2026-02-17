import firebase from "firebase/compat/app";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage, getDownloadURL  } from "firebase/storage";

/* code from our Firebase console */
const firebaseConfig = {}
// Initialize Firebase

const firebaseApp = firebase.initializeApp(firebaseConfig);
var db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const killersColRef = collection(db,"killers");
const skillsColRef = collection(db, "skills");
const perksColRef = collection(db, "perks");
const videosColRef = collection(db,"videos");

const download = (pathReference, list) => {
  getDownloadURL(pathReference)
  .then((url) => {
    list.push(url);
  })
  .catch((error) => {
    console.log(error);
  });
};

export{
  storage, killersColRef, skillsColRef, perksColRef, videosColRef, download, db
};