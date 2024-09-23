let mealValues = {
    breakfast: null,
    lunch: null,
    dinner: null,
    supper: null,
  };
  
  // Get meal values
  app.get('/api/meal-values', (req, res) => {
    res.json(mealValues);
  });
  
  // Save meal values
  app.post('/api/meal-values', (req, res) => {
    const { breakfast, lunch, dinner, supper } = req.body;
    mealValues = { breakfast, lunch, dinner, supper };
    res.json(mealValues);
  });
  