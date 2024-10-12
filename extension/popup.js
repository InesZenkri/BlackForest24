document.addEventListener('DOMContentLoaded', () => {
    const bioCheckbox = document.getElementById('bio-products');
    const cheapestCheckbox = document.getElementById('cheapest-products');
    const talahonCheckbox = document.getElementById('talahon-products');
    const settingsContainer = document.querySelector('.settings');
    const addPreferenceButton = document.querySelector('.footer-option');

    // Retrieve stored preferences
    chrome.storage.sync.get(['bio', 'cheapest', 'talahon', 'customPreferences'], (result) => {
        bioCheckbox.checked = result.bio || false;
        cheapestCheckbox.checked = result.cheapest || false;
        talahonCheckbox.checked = result.talahon || false;

        if (result.customPreferences) {
            result.customPreferences.forEach(pref => {
                createPreference(pref.name, pref.checked);
            });
        }
    });

    // Save preferences when toggled
    const savePreference = (key, value) => {
        chrome.storage.sync.set({ [key]: value });
    };

    bioCheckbox.addEventListener('change', () => savePreference('bio', bioCheckbox.checked));
    cheapestCheckbox.addEventListener('change', () => savePreference('cheapest', cheapestCheckbox.checked));
    talahonCheckbox.addEventListener('change', () => savePreference('talahon', talahonCheckbox.checked));

    // Add preference functionality
    addPreferenceButton.addEventListener('click', () => {
        const preferenceName = prompt("Enter new preference name:");
        if (preferenceName) {
            const newPreference = { name: preferenceName, checked: false };
            createPreference(preferenceName, false);

            chrome.storage.sync.get(['customPreferences'], (result) => {
                const updatedPreferences = result.customPreferences || [];
                updatedPreferences.push(newPreference);
                chrome.storage.sync.set({ customPreferences: updatedPreferences });
            });
        }
    });

    function createPreference(name, isChecked) {
        const settingDiv = document.createElement('div');
        settingDiv.classList.add('setting');

        const labelSpan = document.createElement('span');
        labelSpan.textContent = name;

        const switchLabel = document.createElement('label');
        switchLabel.classList.add('switch');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isChecked;
        checkbox.addEventListener('change', () => {
            chrome.storage.sync.get(['customPreferences'], (result) => {
                const updatedPreferences = result.customPreferences.map(pref =>
                    pref.name === name ? { ...pref, checked: checkbox.checked } : pref
                );
                chrome.storage.sync.set({ customPreferences: updatedPreferences });
            });
        });

        const sliderSpan = document.createElement('span');
        sliderSpan.classList.add('slider', 'round');

        switchLabel.appendChild(checkbox);
        switchLabel.appendChild(sliderSpan);
        settingDiv.appendChild(labelSpan);
        settingDiv.appendChild(switchLabel);

        // Create the divider element
        const divider = document.createElement('div');
        divider.classList.add('divider');

        // Add the new setting div and divider before the "Apply Preferences" button
        settingsContainer.insertBefore(settingDiv, document.getElementById('apply-button'));
        settingsContainer.insertBefore(divider, document.getElementById('apply-button'));
    }

    // Handle the "Apply Preferences" button
    document.getElementById('apply-button').addEventListener('click', () => {
        chrome.storage.sync.get(['bio', 'cheapest', 'talahon', 'customPreferences'], (result) => {
            const preferences = {
                bio: result.bio,
                cheapest: result.cheapest,
                talahon: result.talahon,
                customPreferences: result.customPreferences || []
            };

            chrome.runtime.sendMessage({ action: "savePreferences", preferences });
        });
    });
  });

  function openNewTab(url) {
    // Open the URL in a new tab
    window.open(url, '_blank');
}

// Usage
//document.getElementById('my-eshop').addEventListener('click', function() {
//    openNewTab('shop.html');
//});

// Usage
//document.getElementById('my-eshop').addEventListener('click', function() {
//    openNewTab('shop.html');
//});



// fix the tab to pop window
document.getElementById("my-eshop").addEventListener("click", function(event) {
    event.preventDefault(); // Prevents the default link behavior (opening in a new tab)
    
    window.open("shop.html", "My E-Shop", "width=800,height=600,resizable=yes");
});
