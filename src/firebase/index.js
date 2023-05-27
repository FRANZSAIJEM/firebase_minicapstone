// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import { collection } from 'firebase/firestore'



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB13X1lBU3L1Vo2k7QMgI-e0_k64yvo8Po",
  authDomain: "verifynumber1-92a6c.firebaseapp.com",
  projectId: "verifynumber1-92a6c",
  storageBucket: "verifynumber1-92a6c.appspot.com",
  messagingSenderId: "458285643766",
  appId: "1:458285643766:web:1494443deb739c7d07f9d7",
  measurementId: "G-9ME15T9TM1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db };
export { auth };
// export const postsRef = collection(db, 'posts')
// export const userRef = collection(db, 'users')