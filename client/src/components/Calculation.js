import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebaseConfig';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Calculation = () => {
  const [mealValues, setMealValues] = useState({});
  const [correctionValues, setCorrectionValues] = useState({});
  const [targetBlood, setTargetBlood] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [carbEntries, setCarbEntries] = useState([{ foodItem: '', amount: '', time: new Date().toLocaleTimeString() }]);
  const [carbDose, setCarbDose] = useState(null);
  const [correctionDose, setCorrectionDose] = useState(null);
  const [currentBG, setCurrentBG] = useState(null);
  const [totalInsulinDose, setTotalInsulinDose] = useState(null);
  const [notes, setNotes] = useState('');
  const [penType, setPenType] = useState('child');
  const [userId, setUserId] = useState(null);
  const [warningMsg, setWarningMsg] = useState('');

  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState('');

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const correctionDoc = await getDoc(doc(db, 'users', userId, 'correctionValues', 'data'));
        const mealDoc = await getDoc(doc(db, 'users', userId, 'mealValues', 'data'));

        if (correctionDoc.exists()) {
          const data = correctionDoc.data();
          setCorrectionValues(data);
          setTargetBlood(data.targetBlood);
          setPenType(data.penType);
        }

        if (mealDoc.exists()) {
          setMealValues(mealDoc.data());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const fetchedRecipes = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserData(user.uid);
        fetchRecipes();
      }
    });
  }, []);

  useEffect(() => {
    if (mealValues[selectedMeal]) {
      const totalCarbAmount = carbEntries.reduce((acc, entry) => acc + parseFloat(entry.amount || 0), 0);
      const dose = totalCarbAmount / mealValues[selectedMeal];
      setCarbDose(penType === 'adult' ? Math.round(dose) : Math.round(dose * 2) / 2);
    } else {
      setCarbDose(0);
    }
  }, [carbEntries, mealValues, selectedMeal, penType]);

  useEffect(() => {
    if (currentBG !== null
      
    ) {
      const correctionFactor = correctionValues[`${selectedMeal}I`] || 0;
      if(currentBG < 3.9){
        setWarningMsg('Hypo Warning: Blood Sugars are low, please follow advice given by your gp or nurse')
        setCorrectionDose(0);
      } else if (currentBG > 3.9 && currentBG < 6.9){
        setWarningMsg('');
        setCorrectionDose(0);
      } else if (correctionFactor > 0 && targetBlood !== null) {
        setWarningMsg('');
        const bgDifference = currentBG - targetBlood;
        const dose = bgDifference / correctionFactor;
        setCorrectionDose(penType === 'adult' ? Math.round(dose) : Math.round(dose * 2) / 2);
      } else {
        setCorrectionDose(0);
      }
    }
  }, [currentBG, correctionValues, selectedMeal, targetBlood, penType]);

  useEffect(() => {
    setTotalInsulinDose(carbDose + correctionDose);
  }, [carbDose, correctionDose]);

  const handleMealChange = (e) => setSelectedMeal(e.target.value);
  const handleCurrentBGChange = (e) => setCurrentBG(parseFloat(e.target.value));
  const handleCarbEntriesChange = (index, field, value) => {
    const updatedEntries = [...carbEntries];
    updatedEntries[index][field] = value;
    setCarbEntries(updatedEntries);
  };
  const addCarbEntry = () => setCarbEntries([...carbEntries, { foodItem: '', amount: '', time: new Date().toLocaleTimeString() }]);
  const removeCarbEntry = (index) => {
    const updatedEntries = carbEntries.filter((_, i) => i !== index);
    setCarbEntries(updatedEntries);
  };

  const handleRecipeSelection = (e) => {
    setSelectedRecipe(e.target.value);

    const recipe = recipes.find((r) => r.id === e.target.value);
    if (recipe) {
      const alreadyAdded = carbEntries.some((entry) => entry.foodItem === recipe.name);
      if (!alreadyAdded) {
        setCarbEntries([
          ...carbEntries,
          { foodItem: recipe.name, amount: recipe.nutrition.carbs, time: new Date().toLocaleTimeString() },
        ]);
      }
    }
  };

  const saveToDiary = async () => {
    try {
      const diaryEntry = {
        selectedMeal,
        carbEntries,
        correctionDose,
        carbDose,
        totalInsulinDose,
        notes,
        timestamp: new Date().toISOString(),
      };

      await setDoc(doc(collection(db, 'users', userId, 'diary')), diaryEntry);
      alert('Entry saved to diary!');
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <label htmlFor="mealEating" className="block text-lg font-medium mb-1">Select Meal</label>
        <select id="mealEating" value={selectedMeal} onChange={handleMealChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-transparent appearance-none">
          <option className="bg-white text-black" value="breakfast">Breakfast</option>
          <option className="bg-white text-black" value="lunch">Lunch</option>
          <option className="bg-white text-black" value="dinner">Dinner</option>
          <option className="bg-white text-black" value="supper">Supper</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="currentBG" className="block text-lg font-medium mb-1">Current Blood Glucose</label>
        <input type="number" id="currentBG" value={currentBG || ''} onChange={handleCurrentBGChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </div>
      {warningMsg && (
  <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg">
    {warningMsg}
  </div>
)}

      <div className="mb-4">
        <label className="block text-lg font-medium mb-1">Select Recipe</label>
        <select value={selectedRecipe} onChange={handleRecipeSelection} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">Select a recipe</option>
          {recipes.map((recipe) => (
            <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
          ))}
        </select>
      </div>

      {carbEntries.map((entry, index) => (
        <div key={index} className="flex items-center py-3">
          <input type="text" value={entry.foodItem} onChange={(e) => handleCarbEntriesChange(index, 'foodItem', e.target.value)} placeholder="Meal" className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg mr-2" />
          <input type="number" value={entry.amount} onChange={(e) => handleCarbEntriesChange(index, 'amount', e.target.value)} placeholder="Carbs (g)" className="w-1/4 px-3 py-2 border border-gray-300 rounded-lg mr-2" />
          <span className="w-1/4 px-3 py-2 border border-gray-300 rounded-lg text-center">{entry.time}</span>
          <button onClick={() => removeCarbEntry(index)} className="text-red-500 ml-2">Remove</button>
        </div>
      ))}
      <button onClick={addCarbEntry} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-2">Add Carb Entry</button>

      <div className="mb-4">
        <h3 className="text-lg font-medium">Correction Dose: {correctionDose} units</h3>
        <h3 className="text-lg font-medium">Carb Dose: {carbDose} units</h3>
        <h3 className="text-2xl font-bold py-4">Total Dose: {totalInsulinDose} units</h3>
      </div>

      <div className="mb-4">
        <label htmlFor="notes" className="block text-lg font-medium mb-1">Notes</label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </div>

      <button onClick={saveToDiary} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-600">Save to Diary</button>
    </div>
  );
};

export default Calculation;
