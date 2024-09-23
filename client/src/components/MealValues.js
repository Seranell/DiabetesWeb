import { useState, useEffect } from 'react';

const MealValues = () => {
  const [mealValues, setMealValues] = useState({
    breakfast: null,
    lunch: null,
    dinner: null,
    supper: null,
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then(response => response.json())
      .then(data => {
        if (data.mealValues) {
          setMealValues(data.mealValues);
        }
      });
  }, []);

  const saveMealValues = () => {
    fetch('http://localhost:5000/api/meal-values', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mealValues),
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
    });
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Enter Your Carb Ratio</h2>
      {['breakfast', 'lunch', 'dinner', 'supper'].map((meal, index) => (
        <div key={index} className="mb-4">
          <label htmlFor={`${meal}Value`} className="block text-lg font-medium mb-1">{meal.charAt(0).toUpperCase() + meal.slice(1)}</label>
          <input
            type="number"
            id={`${meal}Value`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            value={mealValues[meal] || ''}
            onChange={(e) => setMealValues(prev => ({ ...prev, [meal]: parseFloat(e.target.value) }))}
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
