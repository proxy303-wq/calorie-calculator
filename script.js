async function getCalories() {
  const foodName = document.getElementById('foodName').value;
  const servingSize = document.getElementById('servingSize').value;
  const result = document.getElementById('result');

  if (!foodName || !servingSize) {
    result.textContent = 'Please enter both food name and serving size.';
    return;
  }

  try {
    const response = await fetch(`/api/calories?foodName=${foodName}`);
    const data = await response.json();

    if (data.foods && data.foods.length > 0) {
      const food = data.foods[0];
      const energyNutrient = food.foodNutrients.find(n => n.nutrientName === 'Energy');
      if (energyNutrient) {
        const caloriesPer100g = energyNutrient.value; // Assuming it's per 100g
        const totalCalories = (caloriesPer100g * servingSize) / 100;

        result.textContent = `Calories for ${servingSize}g of ${food.description}: ${totalCalories.toFixed(2)} kcal`;
      } else {
        result.textContent = 'Calorie data not available for this food.';
      }
    } else {
      result.textContent = 'No results found. Please try another food item.';
    }
  } catch (error) {
    result.textContent = 'Error fetching data. Please try again.';
    console.error(error);
  }
}
