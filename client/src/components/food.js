import { useState, useEffect } from 'react';
import Link from 'next/link';

const FoodSearch = () => {
  const [search, setSearch] = useState('');
  const [foodCategories, setFoodCategories] = useState({});
  const [filteredCategories, setFilteredCategories] = useState({});
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    async function fetchFood() {
      try {
        const response = await fetch('http://localhost:5000/api/food'); // Replace with your API URL
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log('Fetched data:', data); // Debug: Log fetched data
        setFoodCategories(data.categories || {});
        setFilteredCategories(data.categories || {});
      } catch (error) {
        console.error('Error fetching food:', error);
      }
    }
    fetchFood();
  }, []);

  useEffect(() => {
    const filterCategories = (categories, searchTerm) => {
      const filtered = {};
      Object.keys(categories).forEach((category) => {
        const filteredFoods = categories[category].filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredFoods.length > 0) {
          filtered[category] = filteredFoods;
        }
      });
      return filtered;
    };

    setFilteredCategories(filterCategories(foodCategories, search));
  }, [search, foodCategories]);

  const handleSort = (nutrient) => {
    setSortBy(nutrient);

    const sortCategories = (categories, nutrient) => {
      const sorted = {};
      Object.keys(categories).forEach((category) => {
        sorted[category] = [...categories[category]].sort((a, b) => {
          const getNutrientValue = (item, nutrient) => {
            const value = item.nutritional_values[nutrient];
            return parseFloat(value) || 0;
          };

          return getNutrientValue(a, nutrient) - getNutrientValue(b, nutrient);
        });
      });
      return sorted;
    };

    setFilteredCategories(sortCategories(filteredCategories, nutrient));
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
        <div className="flex flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search food..."
            className="flex-1 p-2 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">Sort By</option>
            <option value="energy">Energy</option>
            <option value="protein">Protein</option>
            <option value="carbohydrate">Carbs</option>
            <option value="fat">Fat</option>
          </select>
        </div>
        {Object.keys(filteredCategories).map((category) => (
          <div key={category} className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories[category].map((item) => (
                <a href={`/food/${item.id}`} key={item.id}>
                <a className="rounded-lg shadow-md overflow-hidden block">
                  <img
                    src={item.image || '/default-image.png'}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-gray-600">Energy: {item.nutritional_values.energy || 'N/A'}</p>
                    <p className="text-gray-600">Protein: {item.nutritional_values.protein?.replace('g', '').trim() || 'N/A'}g</p>
                    <p className="text-gray-600">Carbs: {item.nutritional_values.carbohydrate?.replace('g', '').trim() || 'N/A'}g</p>
                    <p className="text-gray-600">Fat: {item.nutritional_values.fat?.replace('g', '').trim() || 'N/A'}g</p>
                  </div>
                </a>
              </a>
              
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodSearch;
