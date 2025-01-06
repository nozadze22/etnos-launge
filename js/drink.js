fetch('drinks.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        displayBeverages(data);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

function displayBeverages(data) {
    const coffeeList = document.getElementById('coffee-list');
    const alcoholList = document.getElementById('alcohol-list');

    // Display coffee
    data.beverages.coffee.forEach(coffee => {
        const li = document.createElement('li');
        li.textContent = `${coffee.name.ka} - ${coffee.price} ლარი`;
        coffeeList.appendChild(li);
    });

    // Display alcohol
    data.beverages.alcohol.forEach(alcohol => {
        const li = document.createElement('li');
        li.textContent = `${alcohol.name.ka} - ${alcohol.price} ლარი (${alcohol.liters} ლიტრი)`;
        alcoholList.appendChild(li);
    });
}