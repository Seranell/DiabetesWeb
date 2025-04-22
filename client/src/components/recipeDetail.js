'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams(); 

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, 'recipes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const recipeData = {
            id: docSnap.id,
            name: data.name || '',
            image: data.image || '',
            nutrition: {
              calories: data.nutrition?.calories || 0,
              protein: data.nutrition?.protein || 0,
              carbs: data.nutrition?.carbs || 0,
              fat: data.nutrition?.fat || 0,
            },
            ingredients: data.ingredients || [],
            steps: data.steps || [],
            source: data.source || '',
          };
          setRecipe(recipeData);
        } else {
          setError(new Error('Recipe not found'));
        }
      } catch (error) {
        setError(error);
        console.error('Error fetching recipe:', error);
      }
    };

    fetchRecipe();
  }, [id]);

  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!recipe) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-white">{recipe.name}</h1>
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-64 object-cover mb-4 rounded-lg"
          />
        )}
        <p className="text-white mb-2">Calories: {recipe.nutrition.calories} kcal</p>
        <p className="text-white mb-2">Protein: {recipe.nutrition.protein} g</p>
        <p className="text-white mb-2">Carbs: {recipe.nutrition.carbs} g</p>
        <p className="text-white mb-2">Fat: {recipe.nutrition.fat} g</p>
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-white">Ingredients</h2>
          <ul className="list-disc ml-6 mt-2 text-white">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-white">{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-white">Steps</h2>
          <ol className="list-decimal ml-6 mt-2 text-white">
            {recipe.steps.map((step, index) => (
              <li key={index} className="text-white py-4">{step}</li>
            ))}
          </ol>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-white">Source</h2>
          {recipe.source && (
            <a
              href={recipe.source}
              className="text-blue-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {recipe.name} - Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;