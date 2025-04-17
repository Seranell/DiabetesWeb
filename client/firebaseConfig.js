import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA9x4pxC7mD1vEy2JhdvRlmyp3bilVQwNo",
  authDomain: "diabeteshonours.firebaseapp.com",
  projectId: "diabeteshonours",
  storageBucket: "diabeteshonours.firebasestorage.app",
  messagingSenderId: "609494651558",
  appId: "1:609494651558:web:e79d94474609cb48f05a67",
  measurementId: "G-G41047VVLY"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export {
  auth,
  provider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  db,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  storage,
  ref,
  uploadBytes,
  getDownloadURL
};