import React, { useState, useEffect } from 'react';

const Calculation = () => {
  // State for Calculation
  const [mealValues, setMealValues] = useState({});
  const [correctionValues, setCorrectionValues] = useState({});
  const [targetBloodGlucose, setTargetBloodGlucose] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [carbEntries, setCarbEntries] = useState([{ foodItem: '', amount: '', time: '' }]);
  const [carbDose, setCarbDose] = useState(null);
  const [correctionDose, setCorrectionDose] = useState(null);
  const [currentBG, setCurrentBG] = useState(null);
  const [currentBGTime, setCurrentBGTime] = useState('');
  const [totalInsulinDose, setTotalInsulinDose] = useState(null);
  const [notes, setNotes] = useState('');
  const [penType, setPenType] = useState('child');
  
  // State for CarbCalculator
  const [foodData, setFoodData] = useState(null);
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [carbAmount, setCarbAmount] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch meal values
        const mealResponse = await fetch('http://localhost:5000/api/meal-values');
        if (!mealResponse.ok) throw new Error('Failed to fetch meal values');
        const mealData = await mealResponse.json();
        setMealValues(mealData);

        // Fetch correction values
        const correctionResponse = await fetch('http://localhost:5000/api/correction-values');
        if (!correctionResponse.ok) throw new Error('Failed to fetch correction values');
        const correctionData = await correctionResponse.json();
        setCorrectionValues(correctionData);
        setTargetBloodGlucose(correctionData.targetBloodGlucose || null);
        setPenType(correctionData.penType || 'child');

        // Fetch food data
        const foodResponse = await fetch('http://localhost:5000/api/food');
        const foodData = await foodResponse.json();
        setFoodData(foodData);

        // Fetch recipes
        const recipeResponse = await fetch('http://localhost:5000/api/recipes');
        if (!recipeResponse.ok) throw new Error('Failed to fetch recipes');
        const recipeData = await recipeResponse.json();
        setRecipes(recipeData.recipes);

      } catch (error) {
        console.error('Error fetching data:', error.message);
        alert('There was an issue fetching data from the server.');
      }
    };

    fetchData();
  }, []);

  // Calculate carb amount based on selected food and quantity
  useEffect(() => {
    if (selectedFood && quantity > 0 && foodData) {
      const food = Object.values(foodData.categories).flat().find(item => item.id === selectedFood);
      if (!food) {
        setCarbAmount(0);
        return;
      }

      const { amount_per, nutritional_values, per_average_item, per_pack } = food;
      let carbsPerUnit;

      if (amount_per.includes('slice') || (foodData.categories.Bread && foodData.categories.Bread.some(bread => bread.id === selectedFood))) {
        if (per_average_item) {
          carbsPerUnit = parseFloat(per_average_item.carbohydrate.replace('g', ''));
          setCarbAmount((carbsPerUnit * quantity).toFixed(1));
        } else {
          setCarbAmount(0);
        }
      } else if (per_pack) {
        const carbsPerPack = parseFloat(per_pack.carbohydrate.replace('g', ''));
        setCarbAmount(((carbsPerPack / quantity) * 100).toFixed(1));
      } else if (amount_per.includes('ml')) {
        carbsPerUnit = parseFloat(nutritional_values.carbohydrate.replace('g', ''));
        setCarbAmount(((carbsPerUnit / 100) * quantity).toFixed(1));
      } else if (amount_per.includes('g')) {
        carbsPerUnit = parseFloat(nutritional_values.carbohydrate.replace('g', ''));
        setCarbAmount(((carbsPerUnit / 100) * quantity).toFixed(1));
      } else {
        setCarbAmount(0);
      }
    }
  }, [selectedFood, quantity, foodData]);

  // Calculate carb dose
  useEffect(() => {
    const savedValue = mealValues[selectedMeal];
    if (savedValue) {
      const totalCarbAmount = carbEntries.reduce((acc, entry) => acc + parseFloat(entry.amount || 0), 0) + parseFloat(carbAmount || 0);
      const recipeCarbs = recipes.find(recipe => recipe.id === selectedRecipe)?.nutrition?.carbs || 0;
      const dose = (totalCarbAmount + recipeCarbs) / savedValue;
      setCarbDose(penType === 'adult' ? Math.round(dose) : Math.round(dose * 2) / 2);
    } else {
      setCarbDose(0);
    }
  }, [carbEntries, mealValues, selectedMeal, penType, carbAmount, selectedRecipe, recipes]);

  // Calculate correction dose
  useEffect(() => {
    let newCorrectionDose = 0;

    if (currentBG !== null) {
      if (currentBG < 6.9) {
        newCorrectionDose = 0;
      } else {
        const correctionFactor = correctionValues[`${selectedMeal}I`] || 0;
        if (correctionFactor > 0 && targetBloodGlucose !== null && !isNaN(currentBG)) {
          const bgDifference = currentBG - targetBloodGlucose;
          const dose = bgDifference / correctionFactor;
          newCorrectionDose = penType === 'adult' ? Math.round(dose) : Math.round(dose * 2) / 2;
        }
      }
    }

    setCorrectionDose(newCorrectionDose);
  }, [currentBG, correctionValues, selectedMeal, targetBloodGlucose, penType]);

  // Calculate total insulin dose
  useEffect(() => {
    setTotalInsulinDose(carbDose + correctionDose);
  }, [carbDose, correctionDose]);

  const handleCarbChange = (index, field, value) => {
    setCarbEntries((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      if (field === 'amount' || field === 'foodItem') {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        updated[index]['time'] = currentTime;
      }
      return updated;
    });
  };

  const addCarbField = () => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCarbEntries((prev) => [...prev, { foodItem: '', amount: '', time: currentTime }]);
  };

  const removeCarbField = (index) => {
    setCarbEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCurrentBGChange = (value) => {
    setCurrentBG(value);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCurrentBGTime(time);
  };

  const saveToDiary = async () => {
    const currentDateTime = new Date();
    // Format the date as YYYY-MM-DD
    const date = currentDateTime.toISOString().split('T')[0]; // Extracts the date part from the ISO string
    const time = currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
    const diaryEntry = {
      date, // Save date in YYYY-MM-DD format
      time,
      meal: selectedMeal,
      foodItems: carbEntries.map(entry => `${recipes.find(recipe => recipe.id === selectedRecipe)?.name || ''} ${entry.foodItem} ${foodData && selectedFood ? foodData.categories.Bread.find(bread => bread.id === selectedFood)?.name || '' : ''}: ${entry.amount} ${ recipes.find(recipe => recipe.id === selectedRecipe)?.nutrition?.carbs || ''} ${parseFloat(carbAmount) || ''}g`).join(', '),
      selectedFood: foodData && selectedFood ? foodData.categories.Bread.find(bread => bread.id === selectedFood)?.name || '' : '',
      selectedFoodCarbs: parseFloat(carbAmount) || 0,
      recipeName: recipes.find(recipe => recipe.id === selectedRecipe)?.name || '',
      recipeCarbs: recipes.find(recipe => recipe.id === selectedRecipe)?.nutrition?.carbs || 0,
      carbs: totalCarbAmount,
      carbDose,
      totalInsulinDose,
      currentBG,
      currentBGTime: currentBGTime,
      correctionDose,
      notes,
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/diary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diaryEntry),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save diary entry: ${response.statusText}`);
      }
  
      alert('Diary entry saved successfully');
      setNotes('');
      setCarbEntries([{ foodItem: '', amount: '', time: '' }]);
      setCurrentBG(null);
      setCurrentBGTime('');
      setSelectedRecipe('');
      setSelectedFood('');
    } catch (error) {
      console.error('Error saving diary entry:', error.message);
      alert('There was a problem saving your diary entry. Please try again.');
    }
  };

  const totalCarbAmount = carbEntries.reduce((acc, entry) => acc + parseFloat(entry.amount || 0), 0) + (parseFloat(carbAmount) || 0) + (recipes.find(recipe => recipe.id === selectedRecipe)?.nutrition?.carbs || 0);

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Select Meal */}
      <div className="mb-4">
        <label htmlFor="mealEating" className="block text-lg font-medium mb-1">Select Meal</label>
        <select
          id="mealEating"
          value={selectedMeal}
          onChange={(e) => setSelectedMeal(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-transparent appearance-none">
          <option className="bg-white text-black" value="breakfast">Breakfast</option>
          <option className="bg-white text-black" value="lunch">Lunch</option>
          <option className="bg-white text-black" value="dinner">Dinner</option>
          <option className="bg-white text-black" value="supper">Supper</option>
        </select>
      </div>

      {/* Select Recipe */}
      <div className="mb-4">
        <label htmlFor="recipeSelect" className="block text-lg font-medium mb-1">Select Recipe (Optional)</label>
        <select
          id="recipeSelect"
          value={selectedRecipe}
          onChange={(e) => setSelectedRecipe(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-none appearance-none">
          <option value="">None</option>
          {recipes.map(recipe => (
            <option className='bg-gray-800' key={recipe.id} value={recipe.id}>{recipe.name}</option>
          ))}
        </select>
      </div>

      {/* Carb Inputs */}
      <div className="mb-4">
        <h3 className="text-3xl py-4">Carbs</h3>
        {carbEntries.map((entry, index) => (
          <div className="flex items-center py-3" key={index}>
            <input
              type="text"
              value={entry.foodItem}
              onChange={(e) => handleCarbChange(index, 'foodItem', e.target.value)}
              placeholder="Meal"
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg mr-2"/>
            <input
              type="number"
              value={entry.amount}
              onChange={(e) => handleCarbChange(index, 'amount', e.target.value)}
              placeholder="Carbs (g)"
              className="w-1/4 px-3 py-2 border border-gray-300 rounded-lg mr-2"/>
            <div className="w-1/4 px-3 py-2">{entry.time}</div>
            <button
              type="button"
              onClick={() => removeCarbField(index)}
              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600">
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCarbField}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          Add Carb Amount
        </button>
      </div>

      {/* Food Selection */}
      <div className="mb-4">
        <label htmlFor="foodSelect" className="block text-lg font-medium mb-2">Select Food Item(Optional)</label>
        <select
          id="foodSelect"
          value={selectedFood}
          onChange={(e) => {
            setSelectedFood(e.target.value);
            setQuantity(0);
            setCarbAmount(null);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select a food item</option>
          {foodData && Object.values(foodData.categories).flat().map(food => (
            <option key={food.id} value={food.id}>{food.name}</option>
          ))}
        </select>
      </div>

      {/* Quantity Input */}
      {selectedFood && foodData && (
        <div className="mb-4">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={`Quantity (${foodData.categories.Bread && foodData.categories.Bread.some(bread => bread.id === selectedFood) ? 'items' : 'g'})`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      )}

      {/* Results */}
      <div id="result" className="mb-4">
        <label className="block text-lg font-medium mb-1">Total Carb Amount</label>
        <div className="text-xl">{totalCarbAmount.toFixed(1)}g</div>
      </div>

      <div id="carbDoseResult" className="mb-4">
        <label className="block text-lg font-medium mb-1">Carb Dose</label>
        <div className="text-xl">{carbDose}</div>
      </div>

      <div className="mb-4">
        <label htmlFor="current" className="block text-lg font-medium mb-1">Current Blood Sugar</label>
        <input
          type="number"
          id="current"
          value={currentBG || ''}
          onChange={(e) => handleCurrentBGChange(parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
        <div className="w-full mt-2 text-gray-600">{currentBGTime}</div>
        {currentBG !== null && currentBG < 3.9 && (
          <div className="mb-4">
            <p className="text-red-600 text-lg">Warning: Your blood sugar is very low; you may be having a hypo. Please treat immediately. Follow these steps to treat hypo:</p>
            <a className='text-gray-400 hover:text-white' href='/hypo-treatment'>Treating a hypo</a>
          </div>
        )}
      </div>

      <div id="correctionResult" className="mb-4">
        <label className="block text-lg font-medium mb-1">Correction Dose</label>
        <div className="text-xl">{correctionDose}</div>
      </div>

      <div className="mb-4">
        <label htmlFor="notes" className="block text-lg font-medium mb-1">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
      </div>

      <div>
        <h3 className="text-2xl font-bold">
          Total Insulin Dose: <span id="totalInsulinDose">{totalInsulinDose}</span>
        </h3>
      </div>

      <button
        type="button"
        onClick={saveToDiary}
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-600">Save to Diary</button>
    </div>
  );
};

export default Calculation;
