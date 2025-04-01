import { useEffect } from "react";
import { db, collection, addDoc } from "../../firebaseConfig"; // Firebase setup
import recipesData from '../../../server/data/recipes.json'; // Import the recipes from your JSON file

export default function AddRecipeForm() {

  // Function to upload all recipes
  const uploadRecipes = async () => {
    try {
      // Get the reference for the 'recipes' collection
      const recipesCollection = collection(db, "recipes");

      // Loop through each recipe in the JSON file
      for (const recipe of recipesData.recipes) {
        // Add each recipe to Firestore
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
    uploadRecipes(); // Automatically upload the recipes when the component is mounted
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
