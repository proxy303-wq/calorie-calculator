document.querySelector('#getCalories').addEventListener('click', async () => {
    const foodName = document.querySelector('#foodInput').value;

    try {
        const response = await fetch(`/api/calories?foodName=${foodName}`);
        const data = await response.json();

        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            document.querySelector('#result').textContent =
                `${data.foodName} contains ${data.calories} kcal.`;
        }
    } catch (error) {
        console.error(error);
        alert('Failed to fetch calorie information.');
    }
});
