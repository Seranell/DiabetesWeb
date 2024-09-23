let diaryEntries = [];
let nextId = 1;

// Get all diary entries
app.get('/api/diary', (req, res) => {
  res.json(diaryEntries);
});

// Add a new diary entry
app.post('/api/diary', (req, res) => {
  const { meal, foodItems, carbs, correctionDose, carbDose, totalInsulinDose, currentBG, notes, date, isToday } = req.body;
  const newEntry = {
    id: nextId++,
    meal,
    foodItems,
    carbs,
    correctionDose,
    carbDose,
    totalInsulinDose,
    currentBG,
    notes,
    date,
    isToday,
  };
  diaryEntries.push(newEntry);
  res.status(201).json(newEntry);
});

// Update a diary entry
app.put('/api/diary/:id', (req, res) => {
  const { id } = req.params;
  const { meal, foodItems, carbs, correctionDose, carbDose, totalInsulinDose, currentBG, notes, date, isToday } = req.body;
  const entryIndex = diaryEntries.findIndex(entry => entry.id === parseInt(id));

  if (entryIndex === -1) {
    return res.status(404).json({ error: 'Entry not found' });
  }

  diaryEntries[entryIndex] = {
    id: parseInt(id),
    meal,
    foodItems,
    carbs,
    correctionDose,
    carbDose,
    totalInsulinDose,
    currentBG,
    notes,
    date,
    isToday,
  };

  res.json(diaryEntries[entryIndex]);
});

// Delete a diary entry
app.delete('/api/diary/:id', (req, res) => {
  const { id } = req.params;
  diaryEntries = diaryEntries.filter(entry => entry.id !== parseInt(id));
  res.status(204).end();
});
