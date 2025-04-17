import { useEffect } from "react";
import { db, collection, addDoc } from "../../firebaseConfig";
import recipesData from '../../../server/data/recipes.json';

export default function AddRecipe() {

  const uploadRecipes = async () => {
    try {
      const recipesCollection = collection(db, "recipes");

      for (const recipe of recipesData.recipes) {
        await addDoc(recipesCollection, {
          id: recipe.id,
          name: recipe.name,
          image: recipe.image,
          nutrition: recipe.nutrition,
          cookingTime: recipe.cookingTime,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          mealType: recipe.mealType,
          tags: recipe.tags,
          source: recipe.source
        });
      }
      console.log('Recipes successfully uploaded!');
    } catch (e) {
      console.error('Error uploading recipes:', e);
    }
  };

  useEffect(() => {
    uploadRecipes();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h1 className="text-2xl font-bold mb-4">Uploading Recipes...</h1>
        <p className="text-gray-600">Your recipes are being uploaded to the database.</p>
      </div>
    </div>
  );
}
