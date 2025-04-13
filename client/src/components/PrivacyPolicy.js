'use client';
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function PrivacyPolicyModal() {
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        setUserId(uid);
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await setDoc(userDocRef, { acceptedPrivacy: false });
          setShowModal(true);
        } else {
          const data = userDoc.data();
          if (!data.acceptedPrivacy) {
            setShowModal(true);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAccept = async () => {
    if (userId) {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        acceptedPrivacy: true,
      });
    }
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Privacy Policy</h2>
        <div className="max-h-64 overflow-y-auto text-sm space-y-2">
          <p>Your privacy is important to us. This app uses Firebase to securely store your data, including authentication and any health-related data you input such as insulin values, carbs, and blood glucose levels.</p>
          <p>We do not share your data with any third parties or use it for advertising or analytics.</p>
          <p>All data is stored securely using Google Firebase and is only accessible to you. You can delete your data at any time by contacting us at BCRAMO200@caledonian.ac.uk, or by deleting your account in the Account Page</p>
          <p>By clicking "Accept", you agree to our privacy policy and consent to the processing of your data as described.</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
