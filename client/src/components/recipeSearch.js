import { useState, useEffect } from 'react';
import Link from 'next/link';

const RecipeSearch = () => {
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [sortBy, setSortBy] = useState(''); 

  
  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await fetch('https://diabetesweb-backend.onrender.com/api/recipes');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setRecipes(data.recipes); 
        setFilteredRecipes(data.recipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    }
    fetchRecipes();
  }, []);

 
  useEffect(() => {
    const results = recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRecipes(results);
  }, [search, recipes]);

  const handleSort = (nutrient) => {
    setSortBy(nutrient);
  
    const sortedRecipes = [...filteredRecipes].sort((a, b) => {
      switch (nutrient) {
        case 'calories':
          return a.nutrition.calories - b.nutrition.calories;
        case 'protein':
          return a.nutrition.protein - b.nutrition.protein;
        case 'carbs':
          return a.nutrition.carbs - b.nutrition.carbs;
        case 'fat':
          return a.nutrition.fat - b.nutrition.fat;
        default:
          return 0;
      }
    });
  
    setFilteredRecipes(sortedRecipes);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
        <div className="flex flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search recipes..."
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
            <option value="calories">Calories</option>
            <option value="protein">Protein</option>
            <option value="carbs">Carbs</option>
            <option value="fat">Fat</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <a href={`/recipes/${recipe.id}`} key={recipe.id}>
                <a className="rounded-lg shadow-md overflow-hidden block">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{recipe.name}</h2>
                    <p className="text-gray-600">Calories: {recipe.nutrition.calories}</p>
                    <p className="text-gray-600">Protein: {recipe.nutrition.protein}g</p>
                    <p className="text-gray-600">Carbs: {recipe.nutrition.carbs}g</p>
                    <p className="text-gray-600">Fat: {recipe.nutrition.fat}g</p>
                  </div>
                </a>
              </a>
            ))
          ) : (
            <p>No recipes found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeSearch;
