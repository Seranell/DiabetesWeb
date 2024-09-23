const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/correction-values.json');

// Load correction values from JSON file
const loadCorrectionValues = () => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  return {
    breakfastI: null,
    lunchI: null,
    dinnerI: null,
    supperI: null,
    targetBloodGlucose: null,
    penType: 'child', // Default value
  };
};

// Save correction values to JSON file
const saveCorrectionValues = (values) => {
  fs.writeFileSync(filePath, JSON.stringify(values, null, 2), 'utf8');
};

// Get correction values
router.get('/', (req, res) => {
  try {
    const correctionValues = loadCorrectionValues();
    res.json(correctionValues);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve correction values' });
  }
});

// Update correction values
router.put('/', (req, res) => {
  try {
    const correctionValues = req.body;

    // Validate input
    if (
      typeof correctionValues.breakfastI !== 'number' ||
      typeof correctionValues.lunchI !== 'number' ||
      typeof correctionValues.dinnerI !== 'number' ||
      typeof correctionValues.supperI !== 'number' ||
      typeof correctionValues.targetBloodGlucose !== 'number' ||
      !['adult', 'child'].includes(correctionValues.penType)
    ) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    saveCorrectionValues(correctionValues);
    res.json({ message: 'Correction values updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update correction values' });
  }
});

module.exports = router;
