window.addEventListener('DOMContentLoaded', async () => {

    chrome.storage.local.get("ingredientList", (result) => {
        if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError);
            return;
        }

        let preferences;
        chrome.storage.sync.get(['bio', 'cheapest', 'talahon', 'customPreferences'], (result) => {
            window.preferences = {
                bio: result.bio || false,
                cheapest: result.cheapest || false,
                talahon: result.talahon || false,
            };
            console.log(window.preferences);
        });

        // Access the ingredientList
        const ingredientList = result.ingredientList;
        if (ingredientList) {
            console.log(ingredientList);
            // for (let item in ingredientList) {
            //     console.log(ingredientList[item].name);
            // }
            // Fetch the data from the JSON file
            fetch('data2.json')
                .then(response => response.json())
                .then(data => {
                    const shopContainer = document.querySelector('.shop-container');
                    console.log(data);
                    // Loop over each category in the JSON data

                    for (let item in ingredientList) {
                        const relevant_products = [];
                        for (let category in data) {
                            for (let product in data[category]) {
                                if (data[category][product].name.includes(ingredientList[item].name)) {
				    const p = data[category][product];
				    p["id"] = category;
                                    relevant_products.push(p);
                                }
                            }
                        }
                        // const res = await askGPT(JSON.stringify(ingredientList), JSON.stringify(window.preferences), JSON.stringify(relevant_products));
                        // console.log(res);

                        // Check if the category is in the list
                        if (relevant_products.length > 0) {
                            const categoryDiv = document.createElement('div');
                            categoryDiv.className = 'category';

                            const categoryTitle = document.createElement('h2');
                            categoryTitle.textContent = ingredientList[item].menge + " " + ingredientList[item].einheit + " " + ingredientList[item].name.charAt(0).toUpperCase() + ingredientList[item].name.slice(1);
                            console.log(categoryTitle.textContent);
                            categoryDiv.appendChild(categoryTitle);

                            // Loop over the products in each category
                            relevant_products.forEach(product => {
                                const productDiv = document.createElement('div');
                                productDiv.className = 'product';

                                productDiv.innerHTML = `
                            <img src="${product.image_url}" alt="${product.name}">
                            <p>${product.name}</p>
                            <p>${product.weight}</p>
                            <p>${product.price}</p>
                            <p hidden>${product.id}</p>
        			<input type="checkbox" class="product-checkbox" data-id="${product.id}">

                        `;
                                categoryDiv.appendChild(productDiv);
                            });

                            shopContainer.appendChild(categoryDiv);
                        }
                    }
                })
                .catch(error => console.error('Error loading product data:', error));
        } else {
            console.log("ingredientList not found in storage.");
        }
    });
    // Event Listener für den "add-to-cart"-Button
    const addToCartButton = document.getElementById('add-to-cart');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function () {

		// Suche nach allen Checkboxen innerhalb von .shop-container, die gecheckt sind
    const selectedCheckboxes = document.querySelectorAll('.product-checkbox:checked');
    const selectedIds = [];

    // Iteriere durch alle ausgewählten Checkboxen und sammle die IDs
    selectedCheckboxes.forEach(checkbox => {
        selectedIds.push(checkbox.getAttribute('data-id'));
    });
if (selectedIds.length > 0) {
console.log("selectedIds: ",selectedIds);
}

            // Greife auf den Inhalt des shop-container der aktuellen Seite zu
            const shopContainerContent = selectedIds;


                        // Sende den Inhalt des shop-container an das Background Script

            chrome.runtime.sendMessage({ action: "sendShopContent", data: shopContainerContent }, (response) => {

                if (response.success) {

                    console.log("Shop content sent successfully.");

                    // Öffne die Warenkorb-Seite

                    window.open('https://ec-offenburg.edeka.shop/warenkorb/', '_blank');

                } else {

                    console.error("Failed to send shop content.");

                }

            });


        });
    } else {
        console.error('Button "add-to-cart" not found.');
    }

});


document.getElementById('my-eshop').addEventListener('click', function () {
    window.open('shop.html', 'My E-Shop', 'height=600,width=800');
});
