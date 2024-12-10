const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

const apiKey = bPm4BEwq5MetNf9NVo9rrZ93dkBByBkjRWbK2ETA ;

app.get("/getNutrition", async (req, res) => {
    try {
        const { food, servingSize } = req.query; // Get food name and serving size from query
        
        // Call USDA API
        const response = await axios.get(
            `https://api.nal.usda.gov/fdc/v1/foods/search`,
            {
                params: {
                    query: food,
                    pageSize: 1, // Get the first result
                    api_key: apiKey,
                },
            }
        );

        const foodData = response.data.foods[0]; // Take the first result
        const baseNutrients = foodData.foodNutrients; // Nutritional data

        // Calculate values based on serving size (if provided)
        const multiplier = servingSize ? servingSize / 100 : 1; // USDA data is per 100g by default

        // Prepare response data
        const nutrients = {
            foodName: foodData.description,
            calories: baseNutrients.find(n => n.nutrientName === "Energy").value * multiplier,
            protein: baseNutrients.find(n => n.nutrientName === "Protein").value * multiplier,
            fats: baseNutrients.find(n => n.nutrientName === "Total lipid (fat)").value * multiplier,
            carbs: baseNutrients.find(n => n.nutrientName === "Carbohydrate, by difference").value * multiplier,
            servingSize: servingSize || 100, // Default is 100g if no serving size is given
        };

        res.json(nutrients);
    } catch (error) {
        console.error("Error fetching nutrition data:", error);
        res.status(500).json({ error: "Failed to fetch nutrition data" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
