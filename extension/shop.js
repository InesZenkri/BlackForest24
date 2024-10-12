document.addEventListener('DOMContentLoaded', () => {
    // Interface for you: combine recipe list from GPT here, we will search it from our database
    // when class not there we will have problem lol (no robustness optimization right now)
    const categoryList = [' Sahne', ' Milch'];

    // Fetch the data from the JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const shopContainer = document.querySelector('.shop-container');

            // Loop over each category in the JSON data
            for (let category in data) {
                // Check if the category is in the list
                if (categoryList.includes(category)) {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.className = 'category';

                    const categoryTitle = document.createElement('h2');
                    categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                    categoryDiv.appendChild(categoryTitle);

                    // Loop over the products in each category
                    data[category].forEach(product => {
                        const productDiv = document.createElement('div');
                        productDiv.className = 'product';

                        productDiv.innerHTML = `
                            <img src="${product.image_url}" alt="${product.name}">
                            <p>${product.name}</p>
                            <p>${product.weight}</p>
                            <p>${product.price}</p>
                            <input type="checkbox">
                        `;
                        categoryDiv.appendChild(productDiv);
                    });

                    shopContainer.appendChild(categoryDiv);
                }
            }
        })
        .catch(error => console.error('Error loading product data:', error));
});

//document.getElementById('my-eshop').addEventListener('click', function() {
//    window.open('shop.html', 'My E-Shop', 'height=600,width=800');
//});