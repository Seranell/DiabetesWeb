'use client';
import { useState, useEffect } from 'react';
import { db, auth, signOut } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { AiOutlineCalculator } from 'react-icons/ai';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md';
import { FaUtensils } from 'react-icons/fa';

export default function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [correctionValues, setCorrectionValues] = useState({});
  const [mealValues, setMealValues] = useState({});

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
      <h1 className="text-4xl font-bold mb-8">
        Welcome, {user?.name || "User"}!
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <a href="/calculation"
          className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 flex flex-col items-center">
          
          <AiOutlineCalculator className="w-12 h-12 text-blue-400 mb-4" />
          <h2 className="text-lg font-semibold">Calculation</h2>
        </a>

        <a href="/diary"
          className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 flex flex-col items-center">
          <FaRegCalendarAlt className="w-12 h-12 text-green-400 mb-4" />

          <h2 className="text-lg font-semibold">Diary</h2>
        </a>

        <a href="/account"
          className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 flex flex-col items-center">

          <MdAccountCircle className="w-12 h-12 text-yellow-400 mb-4" />
          <h2 className="text-lg font-semibold">Account</h2>
        </a>

        <a href="/recipes"
          className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 flex flex-col items-center">
          <FaUtensils className="w-12 h-12 text-red-400 mb-4" />
          <h2 className="text-lg font-semibold">Recipes</h2>
        </a>
      </div>
    </div>
  );
}
