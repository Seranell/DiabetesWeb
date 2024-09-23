const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define file paths
const dataFilePath = path.join(__dirname, 'data.json');

// Read data from file
const readData = () => {
  if (fs.existsSync(dataFilePath)) {
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  }
  return { diary: [], recipes: [], food: [] }; // Ensure recipes key exists
};

// Write data to file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Import authentication routes and middleware
const { router: authRouter, authenticateToken } = require('./auth/auth');

// Import other route files
const mealValuesRouter = require('./routes/meal-values');
const correctionValuesRouter = require('./routes/correction-values');
const diaryRouter = require('./routes/diary');
const recipeRouter = require('./routes/recipes');
const foodRouter = require('./routes/food');

// Use the authentication router
app.use('/api/auth', authRouter);

// Example of a protected route using the authentication middleware
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// API Endpoints
app.get('/api/data', (req, res) => {
  const data = readData();
  res.json(data);
});

// Use other routes
app.use('/api/meal-values', mealValuesRouter);
app.use('/api/correction-values', correctionValuesRouter);
app.use('/api/diary', diaryRouter);
app.use('/api/recipes', recipeRouter);
app.use('/api/food', foodRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
