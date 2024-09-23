const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/food.json');

// Load Food from JSON file
const loadFood = () => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  return { categories: {} };  // Return empty categories if none are found
};

// Save Food to JSON file
const saveFood = (categories) => {
  fs.writeFileSync(filePath, JSON.stringify({ categories }, null, 2), 'utf8');
};

// Get all Food
router.get('/', (req, res) => {
  try {
    const foodData = loadFood();
    res.json(foodData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve food' });
  }
});

// Get a specific food item by ID
router.get('/:id', (req, res) => {
  try {
    const id = req.params.id;
    const foodData = loadFood();
    let foundFood = null;

    Object.keys(foodData.categories).forEach(category => {
      const item = foodData.categories[category].find(r => r.id === id);
      if (item) {
        foundFood = item;
      }
    });

    if (!foundFood) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json(foundFood);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve food' });
  }
});

// Add a new food item
router.post('/', (req, res) => {
  try {
    const newFood = req.body;

    if (!newFood.id || !newFood.name || !newFood.nutritional_values) {
      return res.status(400).json({ message: 'Invalid food data' });
    }

    const foodData = loadFood();
    const category = newFood.category || 'Miscellaneous';
    
    if (!foodData.categories[category]) {
      foodData.categories[category] = [];
    }

    foodData.categories[category].push(newFood);
    saveFood(foodData);

    res.status(201).json({ message: 'Food item added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add food' });
  }
});

// Update a food item by ID
router.put('/:id', (req, res) => {
  try {
    const updatedFood = req.body;
    const id = req.params.id;

    if (!updatedFood.name || !updatedFood.nutritional_values) {
      return res.status(400).json({ message: 'Invalid food data' });
    }

    const foodData = loadFood();
    let foundFood = false;

    Object.keys(foodData.categories).forEach(category => {
      const index = foodData.categories[category].findIndex(r => r.id === id);
      if (index !== -1) {
        foodData.categories[category][index] = { ...foodData.categories[category][index], ...updatedFood };
        foundFood = true;
      }
    });

    if (!foundFood) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    saveFood(foodData);
    res.json({ message: 'Food item updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update food' });
  }
});

// Delete a food item by ID
router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id;

    const foodData = loadFood();
    let foundFood = false;

    Object.keys(foodData.categories).forEach(category => {
      const newCategoryList = foodData.categories[category].filter(r => r.id !== id);
      if (foodData.categories[category].length !== newCategoryList.length) {
        foodData.categories[category] = newCategoryList;
        foundFood = true;
      }
    });

    if (!foundFood) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    saveFood(foodData);
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete food' });
  }
});

module.exports = router;
