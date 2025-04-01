import { useState, useEffect } from 'react';
import { db, auth } from '../../firebaseConfig';  // Firebase configuration import
import { doc, getDoc, setDoc } from 'firebase/firestore';  // Firestore methods
import { onAuthStateChanged } from 'firebase/auth';  // Firebase auth

const MealValues = () => {
  const [mealValues, setMealValues] = useState({
    breakfast: null,
    lunch: null,
    dinner: null,
    supper: null,
  });
  const [userId, setUserId] = useState(null);  // Store current user's ID

  // Listen for user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);  // Save authenticated user's ID
      } else {
        setUserId(null);  // Clear user ID if not authenticated
      }
    });

    return () => unsubscribe();  // Clean up the listener
  }, []);

  // Fetch existing meal values on component mount
  useEffect(() => {
    const fetchMealValues = async () => {
      if (!userId) return;  // Don't fetch if no user is authenticated

      try {
        const docRef = doc(db, "users", userId, "mealValues", "data");  // Firestore path for the meal values document
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMealValues(docSnap.data());  // Set the fetched data to state
        } else {
          console.log("No meal data found, using default values");
          setMealValues({
            breakfast: null,
            lunch: null,
            dinner: null,
            supper: null,
          });
        }
      } catch (error) {
        console.error('Failed to fetch meal values:', error);
      }
    };

    fetchMealValues();
  }, [userId]);

  // Save meal values to Firestore
  const saveMealValues = async () => {
    if (!userId) {
      console.error('User is not authenticated');
      return;
    }

    try {
      const docRef = doc(db, "users", userId, "mealValues", "data");  // Firestore path for saving the meal values
      await setDoc(docRef, mealValues, { merge: true });  // Merge to avoid overwriting other data

      alert('Meal values saved successfully');
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
            onChange={(e) => setMealValues(prev => ({ ...prev, [meal]: parseFloat(e.target.value) }))}  // Update specific meal value
          />
        </div>
      ))}
      <button
        onClick={saveMealValues}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600"
      >
        Save Meal Values
      </button>
    </div>
  );
};

export default MealValues;
