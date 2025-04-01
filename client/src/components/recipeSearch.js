import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Firebase config
import Link from 'next/link';

const RecipeSearch = () => {
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [sortBy, setSortBy] = useState('');

  // Fetch recipes from Firebase
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const fetchedRecipes = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            image: data.image || '',
            nutrition: {
              calories: data.nutrition?.calories || 0,
              protein: data.nutrition?.protein || 0,
              carbs: data.nutrition?.carbs || 0,
              fat: data.nutrition?.fat || 0,
            },
          };
        });

        setRecipes(fetchedRecipes);
        setFilteredRecipes(fetchedRecipes);
      } catch (error) {
        console.error('Error fetching recipes from Firebase:', error);
      }
    };

    fetchRecipes();
  }, []);

  // Handle search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredRecipes(recipes);
      return;
    }

    const results = recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredRecipes(results);
  }, [search, recipes]);

  // Sorting functionality
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
              <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
                <div className="rounded-lg shadow-md overflow-hidden block cursor-pointer">
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
                </div>
              </Link>
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
