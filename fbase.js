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
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: "drop-the-ball-9bf63",
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
logEvent(analytics, "notification_received");

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
};
