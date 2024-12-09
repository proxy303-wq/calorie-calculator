const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Serve static files
app.use(express.static('public'));

// Route to fetch calorie data
app.get('/api/calories', async (req, res) => {
    const { foodName } = req.query;
    const apiKey = process.env.API_KEY;

    try {
        const response = await axios.get(
            `https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodName}&api_key=${apiKey}`
        );
        const food = response.data.foods[0];
        const calories = food.foodNutrients.find(n => n.nutrientName === 'Energy').value;

        res.json({ foodName: food.description, calories });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch calorie data' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000; // Use environment-provided port or default to 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
