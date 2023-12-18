// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import {
  getFirestore,
  collection,
  orderBy,
  query,
  limit,
  getDocs,
  setDoc,
  doc,
  where,
  getDoc,
} from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAr6RL9VXmrwRF8ZuXRh9tChi_xC66GN1I",
  authDomain: "drop-the-ball-9bf63.firebaseapp.com",
  projectId: "drop-the-ball-9bf63",
  storageBucket: "drop-the-ball-9bf63.appspot.com",
  messagingSenderId: "766229072214",
  appId: "1:766229072214:web:c359b563462fa60c4caef7",
  measurementId: "G-CE655T4BQJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const authService = getAuth(app);
export const dbService = getFirestore(app);
export {
  collection,
  orderBy,
  query,
  limit,
  getDocs,
  setDoc,
  doc,
  where,
  getDoc,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  analytics,
};
