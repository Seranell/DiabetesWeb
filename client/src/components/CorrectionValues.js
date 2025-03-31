import { useState, useEffect } from 'react';
import { db, auth } from '../../../firebaseConfig';  // Import Firebase and auth
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';  // Firestore methods
import { onAuthStateChanged } from 'firebase/auth';  // Listen for user auth state changes

const CorrectionValues = () => {
  const [correctionValues, setCorrectionValues] = useState({
    breakfastI: null,
    lunchI: null,
    dinnerI: null,
    supperI: null,
    targetBlood: null,
    penType: 'child', // Default to child pen
  });
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // Store current user's ID

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);  // Save the authenticated user's ID
      } else {
        setUserId(null);  // Clear the user ID if not authenticated
      }
    });

    return () => unsubscribe();  // Clean up the listener
  }, []);

  // Fetch saved correction values from Firestore for the authenticated user
  useEffect(() => {
    const fetchCorrectionValues = async () => {
      if (!userId) return;  // Don't fetch if no user is authenticated

      try {
        const docRef = doc(db, "users", userId, "correctionValues", "data");  // Reference the correctionValues sub-collection
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Fetched data:", docSnap.data());
          setCorrectionValues(docSnap.data());
        } else {
          console.log("No correction data found, using default values");
          setCorrectionValues({
            breakfastI: null,
            lunchI: null,
            dinnerI: null,
            supperI: null,
            targetBlood: null,
            penType: 'child',
          });
        }
      } catch (error) {
        console.error('Failed to fetch correction values:', error);
        setError('Failed to fetch correction values');
      }
    };

    fetchCorrectionValues();
  }, [userId]);

  // Handle input changes correctly for radio buttons and other inputs
  const handleChange = (event) => {
    const { id, value, type, checked, name } = event.target;

    setCorrectionValues((prevValues) => ({
      ...prevValues,
      [type === "radio" ? name : id]: type === "radio" ? (checked ? id : prevValues[name]) : parseFloat(value) || null,
    }));
  };

  // Save correction values to Firestore for the authenticated user
  const saveCorrectionValues = async () => {
    if (!userId) {
      setError('You must be logged in to save your data');
      return;
    }

    try {
      const docRef = doc(db, "users", userId, "correctionValues", "data");  // Reference the correctionValues sub-collection
      console.log("Saving data:", correctionValues);
      await setDoc(docRef, correctionValues, { merge: true });  // Merge the data (not overwrite)

      alert('Correction values saved successfully');
      setError(null);
    } catch (error) {
      console.error('Failed to save correction values:', error);
      setError('Failed to save correction values');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-3xl mb-4">Enter Correction Values</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {['breakfastI', 'lunchI', 'dinnerI', 'supperI'].map((correction) => (
        <div key={correction} className="mb-4">
          <label htmlFor={correction} className="block text-lg font-medium mb-1">
            {correction.charAt(0).toUpperCase() + correction.slice(1).replace('I', '')}:
          </label>
          <input
            type="number"
            id={correction}
            value={correctionValues[correction] || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      ))}
      <div className="mb-4">
        <label htmlFor="targetBlood" className="block text-lg font-medium mb-1">
          Target Blood Glucose:
        </label>
        <input
          type="number"
          id="targetBlood"
          value={correctionValues.targetBlood || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-medium mb-1">Select Pen Type:</label>
        <div>
          <label className="mr-4">
            <input
              type="radio"
              id="adult"
              name="penType"
              checked={correctionValues.penType === "adult"}
              onChange={handleChange}
            />
            <span className="ml-2">Adult Pen</span>
          </label>
          <label>
            <input
              type="radio"
              id="child"
              name="penType"
              checked={correctionValues.penType === "child"}
              onChange={handleChange}
            />
            <span className="ml-2">Child Pen</span>
          </label>
        </div>
      </div>
      <button
        onClick={saveCorrectionValues}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Save Correction Values
      </button>
    </div>
  );
};

export default CorrectionValues;
