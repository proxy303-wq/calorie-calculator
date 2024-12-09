const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Serve static files
app.use(express.static('public'));

// API route to fetch calorie data
app.get('/api/calories', async (req, res) => {
    const { foodName } = req.query; // Extract foodName from the request
    const apiKey = process.env.API_KEY; // Get API key from .env

    try {
        // Call USDA FoodData Central API
        const response = await axios.get(
            `https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodName}&api_key=${apiKey}`
        );

        // Extract calorie data from the API response
        const food = response.data.foods[0]; // First matching food item
        const calories = food.foodNutrients.find(n => n.nutrientName === 'Energy').value;

        // Send the result back to the client
        res.json({ foodName: food.description, calories });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to fetch calorie data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
