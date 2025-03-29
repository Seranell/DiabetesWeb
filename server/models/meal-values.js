const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Directory to store user-specific meal values
const dataDirectory = path.join(__dirname, '../data/meal-values');

// Ensure the directory exists
if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

// Load meal values for a specific user
const loadMealValues = (userId) => {
  const filePath = path.join(dataDirectory, `${userId}.json`);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  // Return default values if user has no saved data
  return {
    breakfast: null,
    lunch: null,
    dinner: null,
    supper: null,
  };
};

// Save meal values for a specific user
const saveMealValues = (userId, values) => {
  const filePath = path.join(dataDirectory, `${userId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(values, null, 2), 'utf8');
};

// GET meal values for a specific user
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const mealValues = loadMealValues(userId);
    res.json(mealValues);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve meal values' });
  }
});

// POST meal values for a specific user
router.post('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const mealValues = req.body;

    // Validate input
    if (
      typeof mealValues.breakfast !== 'number' ||
      typeof mealValues.lunch !== 'number' ||
      typeof mealValues.dinner !== 'number' ||
      typeof mealValues.supper !== 'number'
    ) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    saveMealValues(userId, mealValues);
    res.json({ message: 'Meal values saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save meal values' });
  }
});

module.exports = router;
