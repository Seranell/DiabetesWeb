const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/recipes.json');

// Load recipes from JSON file
const loadRecipes = () => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  return { recipes: [] };  // Return an empty array if no recipes are found
};

// Save recipes to JSON file
const saveRecipes = (recipes) => {
  fs.writeFileSync(filePath, JSON.stringify({ recipes }, null, 2), 'utf8');
};

// Get all recipes
router.get('/', (req, res) => {
  try {
    const recipesData = loadRecipes();
    res.json(recipesData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve recipes' });
  }
});


// Add a new recipe
router.post('/', (req, res) => {
  try {
    const newRecipe = req.body;

    if (!newRecipe.id || !newRecipe.name || !newRecipe.ingredients || !newRecipe.steps) {
      return res.status(400).json({ message: 'Invalid recipe data' });
    }

    const recipesData = loadRecipes();
    recipesData.recipes.push(newRecipe);
    saveRecipes(recipesData);

    res.status(201).json({ message: 'Recipe added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add recipe' });
  }
});

router.get('/:id', (req, res) => {
    try {
      const recipeId = req.params.id;
      const recipesData = loadRecipes();
      const recipe = recipesData.recipes.find(r => r.id === recipeId);
  
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve recipe' });
    }
  });

// Update a recipe by ID
router.put('/:id', (req, res) => {
  try {
    const updatedRecipe = req.body;
    const recipeId = req.params.id;

    if (!updatedRecipe.name || !updatedRecipe.ingredients || !updatedRecipe.steps) {
      return res.status(400).json({ message: 'Invalid recipe data' });
    }

    const recipesData = loadRecipes();
    const recipeIndex = recipesData.recipes.findIndex(r => r.id === recipeId);

    if (recipeIndex === -1) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    recipesData.recipes[recipeIndex] = { ...recipesData.recipes[recipeIndex], ...updatedRecipe };
    saveRecipes(recipesData);

    res.json({ message: 'Recipe updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update recipe' });
  }
});

// Delete a recipe by ID
router.delete('/:id', (req, res) => {
  try {
    const recipeId = req.params.id;

    const recipesData = loadRecipes();
    const newRecipes = recipesData.recipes.filter(r => r.id !== recipeId);

    if (recipesData.recipes.length === newRecipes.length) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    saveRecipes({ recipes: newRecipes });
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete recipe' });
  }
});

module.exports = router;
