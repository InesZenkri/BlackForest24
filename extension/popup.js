document.addEventListener('DOMContentLoaded', () => {
    const bioCheckbox = document.getElementById('bio-products');
    const cheapestCheckbox = document.getElementById('cheapest-products');
    const talahonCheckbox = document.getElementById('talahon-products');
  
    // Retrieve stored preferences
    chrome.storage.sync.get(['bio', 'cheapest', 'talahon'], (result) => {
        bioCheckbox.checked = result.bio || false; // Default to false if not set
        cheapestCheckbox.checked = result.cheapest || false;
        talahonCheckbox.checked = result.talahon || false; // Fixed the property name
    });
  
    // Save preferences when toggled
    bioCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ bio: bioCheckbox.checked });
    });
  
    cheapestCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ cheapest: cheapestCheckbox.checked });
    });
  
    talahonCheckbox.addEventListener('change', () => { 
        chrome.storage.sync.set({ talahon: talahonCheckbox.checked });
    });

    document.querySelector(".shop").addEventListener("click", () => {
  chrome.windows.create({
    url: "shop.html",
    type: "popup",
    width: 500,
    height: 600
  });
});

    // Handle the "Apply Preferences" button
    document.getElementById('apply-button').addEventListener('click', () => {
        chrome.storage.sync.get(['bio', 'cheapest', 'talahon'], (result) => {
            const preferences = {
                bio: result.bio,
                cheapest: result.cheapest,
                talahon: result.talahon,
            };
  
            // Send preferences to the background script
            chrome.runtime.sendMessage({ action: "savePreferences", preferences: preferences });
        });
    });
  });
  