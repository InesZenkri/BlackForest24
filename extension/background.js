// background.js

// Fetch preferences from the API
function fetchPreferencesFromAPI() {
    return fetch('http://127.0.0.1:5000/preferences')
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching preferences:', error);
            return null; // Return null in case of error
        });
}

// Listener for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPreferences') {
        fetchPreferencesFromAPI().then(preferences => {
            sendResponse(preferences || { bioProducts: true, cheapestProducts: false, talahon: false });
        });
        return true; 
    }

    if (request.action === 'setPreferences') {
        // Save preferences to the API
        fetch('http://127.0.0.1:5000/preferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request.preferences),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Preferences updated:', data);
            sendResponse({ success: true });
        })
        .catch(error => {
            console.error('Error saving preferences:', error);
            sendResponse({ success: false });
        });
        return true; 
    }
});
