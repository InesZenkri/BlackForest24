
chrome.runtime.sendMessage({ action: "getPreferences" }, (response) => {
    if (response && response.preferences) {
        console.log("User Preferences:", response.preferences);
        // Use the preferences for filtering or any other purpose here
        if (response.preferences.bio) {
            console.log("User prefers Bio products.");
            // Apply filtering logic here
        }
        if (response.preferences.cheapest) {
            console.log("User prefers cheapest products.");
            // Apply filtering logic here
        }
        if (response.preferences.talahon) {
            console.log("User prefers Talahon products.");
            // Apply filtering logic here
        }
    } else {
        console.log("No preferences found.");
    }
});


window.addEventListener("load", () => {
  if (document.body.innerText.includes("Rezept")) {
      console.log("This page contains a recipe.");
      queryGPT(document.body.innerText);
  }
});