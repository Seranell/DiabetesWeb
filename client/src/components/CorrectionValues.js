'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '../../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const CorrectionValues = () => {
  const [correctionValues, setCorrectionValues] = useState({
    breakfastI: '',
    lunchI: '',
    dinnerI: '',
    supperI: '',
    targetBlood: '',
    penType: 'child',
  });
  const [error, setError] = useState(null);
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
    const fetchCorrectionValues = async () => {
      if (!userId) return;

      try {
        const docRef = doc(db, "users", userId, "correctionValues", "data");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCorrectionValues(docSnap.data());
        } else {
          setCorrectionValues({
            breakfastI: '',
            lunchI: '',
            dinnerI: '',
            supperI: '',
            targetBlood: '',
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

  useEffect(() => {
    const allFieldsFilled = Object.entries(correctionValues).every(([key, value]) => {
      if (key === "penType") {
        return value === "child" || value === "adult";
      }
      return value !== '' && !isNaN(parseFloat(value));
    });

    setIsValid(allFieldsFilled);
  }, [correctionValues]);

  const handleChange = (event) => {
    const { id, value, type, checked, name } = event.target;

    setCorrectionValues((prevValues) => ({
      ...prevValues,
      [type === "radio" ? name : id]: type === "radio" ? (checked ? id : prevValues[name]) : value,
    }));
  };

  const saveCorrectionValues = async () => {
    if (!userId) {
      setError('You must be logged in to save your data');
      return;
    }

    try {
      const docRef = doc(db, "users", userId, "correctionValues", "data");
      await setDoc(docRef, correctionValues, { merge: true });

      alert('Correction values saved successfully');
      setError(null);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save correction values:', error);
      setError('Failed to save correction values');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Enter Correction Values</h2>
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

      <button
        onClick={saveCorrectionValues}
        disabled={!isValid}
        className={`px-4 py-2 rounded-lg mt-4 ${
          isValid
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Save Correction Values
      </button>
    </div>
  );
};

export default CorrectionValues;
