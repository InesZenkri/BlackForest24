window.addEventListener('DOMContentLoaded', async () => {

    chrome.storage.local.get("finalList", (result) => {
        if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError);
            return;
        }

        chrome.storage.sync.get(['bio', 'cheapest', 'talahon', 'customPreferences'], (result) => {
            window.preferences = {
                bio: result.bio || false,
                cheapest: result.cheapest || false,
                talahon: result.talahon || false,
            };
            console.log(window.preferences);
        });

        // Access the ingredientList
        const ingredientList = result.finalList;
        if (ingredientList) {
            console.log(ingredientList);
            // for (let item in ingredientList) {
            //     console.log(ingredientList[item].name);
            // }
            // Fetch the data from the JSON file
                const shopContainer = document.querySelector('.shop-container');
                // Loop over each category in the JSON data

                for (let products in ingredientList) {
                    // const res = await askGPT(JSON.stringify(ingredientList), JSON.stringify(window.preferences), JSON.stringify(relevant_products));
                    // console.log(res);
                    console.log(ingredientList[products]);
                    // Check if the category is in the list
                    if (ingredientList[products].relevant_products.length > 0) {
                        if (ingredientList[products].relevant_products[0] !== null) {
                            const categoryDiv = document.createElement('div');
                            categoryDiv.className = 'category';

                            const categoryTitle = document.createElement('h2');
                            categoryTitle.textContent = ingredientList[products].item.menge + " " + ingredientList[products].item.einheit + " " + ingredientList[products].item.name.charAt(0).toUpperCase() + ingredientList[products].item.name.slice(1);
                            console.log(categoryTitle.textContent);
                            categoryDiv.appendChild(categoryTitle);

                            // Loop over the products in each category
                            ingredientList[products].relevant_products.forEach(product => {
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
                }

        } else {
            console.log("ingredientList not found in storage.");
        }
    });

});


document.getElementById('my-eshop').addEventListener('click', function () {
    window.open('shop.html', 'My E-Shop', 'height=600,width=800');
});