const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/meal-values.json');

// Load meal values from JSON file
const loadMealValues = () => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  return {
    breakfast: null,
    lunch: null,
    dinner: null,
    supper: null,
  };
};

// Save meal values to JSON file
const saveMealValues = (mealValues) => {
  fs.writeFileSync(filePath, JSON.stringify(mealValues, null, 2), 'utf8');
};

// Get meal values
router.get('/', (req, res) => {
  try {
    const mealValues = loadMealValues();
    res.json(mealValues);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve meal values' });
  }
});

// Update meal values
router.put('/', (req, res) => {
  try {
    const { breakfast, lunch, dinner, supper } = req.body;

    // Validate input
    if (
      typeof breakfast !== 'number' ||
      typeof lunch !== 'number' ||
      typeof dinner !== 'number' ||
      typeof supper !== 'number'
    ) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const mealValues = {
      breakfast,
      lunch,
      dinner,
      supper,
    };

    saveMealValues(mealValues);
    res.json({ message: 'Meal values updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update meal values' });
  }
});

module.exports = router;
