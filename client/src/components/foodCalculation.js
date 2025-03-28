import React, { useState, useEffect } from 'react';

const fetchFoodData = async () => {
  const response = await fetch('https://diabetesweb-backend.onrender.com/api/food');
  const data = await response.json();
  return data;
};

const CarbCalculator = () => {
  const [foodData, setFoodData] = useState(null);
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [carbAmount, setCarbAmount] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchFoodData();
        setFoodData(data);
      } catch (error) {
        console.error('Error fetching food data:', error);
      }
    };

    getData();
  }, []);

  const handleFoodChange = (e) => {
    const foodId = e.target.value;
    setSelectedFood(foodId);
    setQuantity(0);
    setCarbAmount(null);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  useEffect(() => {
    if (selectedFood && quantity > 0) {
      calculateCarbs();
    }
  }, [selectedFood, quantity]);

  const calculateCarbs = () => {
    if (!foodData || !selectedFood) {
      setCarbAmount(0);
      return;
    }

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
      const carbsPerPack = parseFloat(per_pack.carbohydrate.replace('pack', ''));
      setCarbAmount(((carbsPerPack / quantity) * 100).toFixed(1));
    } else if (amount_per.includes('ml')) {
      carbsPerUnit = parseFloat(nutritional_values.carbohydrate.replace('ml', ''));
      setCarbAmount(((carbsPerUnit / 100) * quantity).toFixed(1));
    } else if (amount_per.includes('g')) {
      carbsPerUnit = parseFloat(nutritional_values.carbohydrate.replace('g', ''));
      setCarbAmount(((carbsPerUnit / 100) * quantity).toFixed(1));
    } else {
      setCarbAmount(0);
    }
  };

  const renderInputs = () => {
    if (!selectedFood || !foodData) return null;

    const food = Object.values(foodData.categories).flat().find(item => item.id === selectedFood);
    const { amount_per } = food;

    if (amount_per.includes('slice') || (foodData.categories.Bread && foodData.categories.Bread.some(bread => bread.id === selectedFood))) {
      return (
        <>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            placeholder="Quantity (slice)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </>
      );
    }

    return (
      <>
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          placeholder={`Quantity (${amount_per})`}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Carb Calculator</h2>

      <div className="mb-4">
        <label htmlFor="foodSelect" className="block text-lg font-medium mb-2">Select Food Item</label>
        <select
          id="foodSelect"
          value={selectedFood}
          onChange={handleFoodChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select a food item</option>
          {foodData && Object.values(foodData.categories).flat().map(food => (
            <option key={food.id} value={food.id}>{food.name}</option>
          ))}
        </select>
      </div>

      {renderInputs()}

      {carbAmount !== null && (
        <div className="mt-4">
          <h3 className="text-xl">Total Carbs: {carbAmount}g</h3>
        </div>
      )}
    </div>
  );
};

export default CarbCalculator;
