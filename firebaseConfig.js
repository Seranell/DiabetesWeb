// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9x4pxC7mD1vEy2JhdvRlmyp3bilVQwNo",
  authDomain: "diabeteshonours.firebaseapp.com",
  projectId: "diabeteshonours",
  storageBucket: "diabeteshonours.firebasestorage.app",
  messagingSenderId: "609494651558",
  appId: "1:609494651558:web:e79d94474609cb48f05a67",
  measurementId: "G-G41047VVLY"
};

// Initialize Firebase
let app;
if (typeof window !== "undefined") {
    app = initializeApp(firebaseConfig);
}

const auth = app ? getAuth(app) : null;
const provider = new GoogleAuthProvider();
const db = app ? getFirestore(app) : null;

export { auth, provider, signInWithPopup, signOut, db, doc, setDoc, getDoc, collection, addDoc };