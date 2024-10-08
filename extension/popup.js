document.addEventListener('DOMContentLoaded', () => {
  const bioCheckbox = document.getElementById('bio-products');
  const cheapestCheckbox = document.getElementById('cheapest-products');
  const talahonCheckbox = document.getElementById('talahon');

  // Load saved preferences on extension open
  chrome.runtime.sendMessage({ action: 'getPreferences' }, (data) => {
      bioCheckbox.checked = data.bioProducts || false;
      cheapestCheckbox.checked = data.cheapestProducts || false;
      talahonCheckbox.checked = data.talahon || false;
  });

  // Save preferences when toggled
  bioCheckbox.addEventListener('change', () => {
      chrome.runtime.sendMessage({ action: 'setPreferences', preferences: { bioProducts: bioCheckbox.checked } });
  });

  cheapestCheckbox.addEventListener('change', () => {
      chrome.runtime.sendMessage({ action: 'setPreferences', preferences: { cheapestProducts: cheapestCheckbox.checked } });
  });

  talahonCheckbox.addEventListener('change', () => {
      chrome.runtime.sendMessage({ action: 'setPreferences', preferences: { talahon: talahonCheckbox.checked } });
  });

  document.getElementById('apply-button').addEventListener('click', () => {
      console.log('Preferences applied');
  });
});
