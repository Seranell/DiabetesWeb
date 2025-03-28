const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const diaryFilePath = path.join(__dirname, '../data/diary-entries.json');

// Read data from file
const readData = () => {
  if (fs.existsSync(diaryFilePath)) {
    return JSON.parse(fs.readFileSync(diaryFilePath, 'utf8'));
  }
  return [];
};

// Write data to file
const writeData = (data) => {
  fs.writeFileSync(diaryFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Get all diary entries
router.get('/', (req, res) => {
  const entries = readData();
  res.json(entries);
});

// Get a specific diary entry by ID
router.get('/:id', (req, res) => {
  const entries = readData();
  const entry = entries.find(e => e.id === parseInt(req.params.id));
  if (entry) {
    res.json(entry);
  } else {
    res.status(404).json({ message: 'Entry not found' });
  }
});


router.post('/', (req, res) => {
    const entries = readData();
    const newEntry = {
      id: Date.now(), 
      date: req.body.date || null,
      time: req.body.time || null,
      meal: req.body.meal || null,
      food: req.body.food || null,
      carbs: req.body.carbs || null,
      currentBG: req.body.currentBG || null,
      correctionDose: req.body.correctionDose || null,
      carbDose: req.body.carbDose || null,
      totalInsulinDose: req.body.totalInsulinDose || null,
      notes: req.body.notes || null
    };
    entries.push(newEntry);
    writeData(entries);
    res.status(201).json(newEntry);
  });
  
  // Update a diary entry by ID
  router.put('/:id', (req, res) => {
    const entries = readData();
    const index = entries.findIndex(e => e.id === parseInt(req.params.id));
    if (index !== -1) {
      entries[index] = {
        id: entries[index].id,
        date: req.body.date || entries[index].date,
        time: req.body.time || entries[index].time, // Include time field
        meal: req.body.meal || entries[index].meal,
        food: req.body.food || entries[index].food,
        carbs: req.body.carbs || entries[index].carbs,
        currentBG: req.body.currentBG || entries[index].currentBG,
        correctionDose: req.body.correctionDose || entries[index].correctionDose,
        carbDose: req.body.carbDose || entries[index].carbDose,
        totalInsulinDose: req.body.totalInsulinDose || entries[index].totalInsulinDose,
        notes: req.body.notes || entries[index].notes
      };
      writeData(entries);
      res.json(entries[index]);
    } else {
      res.status(404).json({ message: 'Entry not found' });
    }
  });
  

// Delete a diary entry by ID
router.delete('/:id', (req, res) => {
  const entries = readData();
  const newEntries = entries.filter(e => e.id !== parseInt(req.params.id));
  writeData(newEntries);
  res.status(204).end();
});

module.exports = router;
