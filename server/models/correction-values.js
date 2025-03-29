const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Directory to store user-specific correction values
const dataDirectory = path.join(__dirname, '../data/correction-values');

// Ensure the directory exists
if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

// Load correction values for a specific user
const loadCorrectionValues = (userId) => {
  const filePath = path.join(dataDirectory, `${userId}.json`);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  // Return default values if user has no saved data
  return {
    breakfastI: null,
    lunchI: null,
    dinnerI: null,
    supperI: null,
    targetBlood: null,
    penType: 'child',
  };
};

// Save correction values for a specific user
const saveCorrectionValues = (userId, values) => {
  const filePath = path.join(dataDirectory, `${userId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(values, null, 2), 'utf8');
};

// GET correction values for a specific user
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const correctionValues = loadCorrectionValues(userId);
    res.json(correctionValues);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve correction values' });
  }
});

// POST correction values for a specific user
router.post('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const correctionValues = req.body;

    // Validate input
    if (
      typeof correctionValues.breakfastI !== 'number' ||
      typeof correctionValues.lunchI !== 'number' ||
      typeof correctionValues.dinnerI !== 'number' ||
      typeof correctionValues.supperI !== 'number' ||
      typeof correctionValues.targetBlood !== 'number' ||
      !['adult', 'child'].includes(correctionValues.penType)
    ) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    saveCorrectionValues(userId, correctionValues);
    res.json({ message: 'Correction values saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save correction values' });
  }
});

module.exports = router;
