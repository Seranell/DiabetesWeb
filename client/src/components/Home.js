'use client';
import { useState, useEffect } from 'react';
import { db, auth, signOut } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function Dashboard() {
  // State variables
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [correctionValues, setCorrectionValues] = useState({});
  const [mealValues, setMealValues] = useState({});

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUser({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        });
      } else {
        setUserId(null);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const correctionDoc = await getDoc(doc(db, 'users', userId, 'correctionValues', 'data'));
        const mealDoc = await getDoc(doc(db, 'users', userId, 'mealValues', 'data'));

        if (correctionDoc.exists()) {
          setCorrectionValues(correctionDoc.data());
        }

        if (mealDoc.exists()) {
          setMealValues(mealDoc.data());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', error);
      alert(`Error signing out: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black to-gray-800 text-white flex flex-col items-center justify-center p-6">
      {/* Greeting */}
      <h1 className="text-4xl font-bold mb-8">
        Welcome, {user?.name || "User"}!
      </h1>

      {/* Navigation Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <a
          href="/calculation"
          className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105"
        >
          <div className="text-blue-400 mb-4">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M8 9h8M8 13h5m-1 8a9 9 0 100-18 9 9 0 000 18z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Calculation</h2>
        </a>

        <a
          href="/diary"
          className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105"
        >
          <div className="text-green-400 mb-4">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Diary</h2>
        </a>

        <a
          href="/account"
          className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105"
        >
          <div className="text-yellow-400 mb-4">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.822.63 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0zm-9 7a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Account</h2>
        </a>

        <a
          href="/recipes"
          className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105"
        >
          <div className="text-red-400 mb-4">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M20 12H4m16 0a8 8 0 10-16 0 8 8 0 0016 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Recipes</h2>
        </a>
      </div>

    </div>
  );
}
