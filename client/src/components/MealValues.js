'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '../../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const MealValues = () => {
  const [mealValues, setMealValues] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
    supper: '',
  });
  const [userId, setUserId] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchMealValues = async () => {
      if (!userId) return;

      try {
        const docRef = doc(db, "users", userId, "mealValues", "data");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMealValues(docSnap.data());
        } else {
          console.log("No meal data found, using default values");
          setMealValues({
            breakfast: '',
            lunch: '',
            dinner: '',
            supper: '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch meal values:', error);
      }
    };

    fetchMealValues();
  }, [userId]);

  useEffect(() => {
    const allFieldsFilled = Object.values(mealValues).every(
      (value) => value !== '' && !isNaN(value)
    );
    setIsValid(allFieldsFilled);
  }, [mealValues]);

  const saveMealValues = async () => {
    if (!userId) {
      console.error('User is not authenticated');
      return;
    }

    try {
      const docRef = doc(db, "users", userId, "mealValues", "data");
      await setDoc(docRef, mealValues, { merge: true });

      alert('Meal values saved successfully');
      router.push('/correction');
    } catch (error) {
      console.error("Error saving meal values:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Enter Your Carb Ratio</h2>
      {['breakfast', 'lunch', 'dinner', 'supper'].map((meal, index) => (
        <div key={index} className="mb-4">
          <label htmlFor={`${meal}Value`} className="block text-lg font-medium mb-1">
            {meal.charAt(0).toUpperCase() + meal.slice(1)}
          </label>
          <input
            type="number"
            id={`${meal}Value`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            value={mealValues[meal] || ''}
            onChange={(e) =>
              setMealValues(prev => ({ ...prev, [meal]: e.target.value }))
            }
          />
        </div>
      ))}
      <button
        onClick={saveMealValues}
        disabled={!isValid}
        className={`px-4 py-2 rounded-lg mt-4 ${
          isValid
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-blue-500  bg-opacity-25 text-gray-500 cursor-not-allowed"
        }`}
      >
        Save Meal Values
      </button>
    </div>
  );
};

export default MealValues;
