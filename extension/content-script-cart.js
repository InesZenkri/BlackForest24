// content-script-cart.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('Inhalt von shop-container0:', message.data);
    if (message.action === "receiveShopContent") {
        console.log('Inhalt von shop-container:', message.data);

    addItemsToCart(message.data);

    }
});


// Funktion, um mehrere Artikel in den Warenkorb zu legen
async function addItemsToCart(datapoints) {
  const url = 'https://ec-offenburg.edeka.shop/index.php?';

  const headers = {
    'Accept': '*/*',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cookie': 'language=0; sid=lai0qvrg4tu8obp5vqtgnd06e4; sid_key=oxid; LOCNR=046921',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    'Origin': 'https://ec-offenburg.edeka.shop',
    'Referer': 'https://ec-offenburg.edeka.shop/index.php?stoken=FF9AF4EF&sid=lai0qvrg4tu8obp5vqtgnd06e4&lang=0&cl=search&searchparam=mehl',
    'X-Requested-With': 'XMLHttpRequest',
  };


  // Erstellt ein Array von Promises für die Fetch-Requests

  const fetchPromises = datapoints.map(datapoint => {

    const body = new URLSearchParams({

      listtype: 'search',

      actcontrol: 'search',

      searchparam: 'mehl',

      searchmanufacturer: '_search_empty_',

      stoken: 'FF9AF4EF',

      lang: '0',

      pgNr: '0',

      cl: 'alist',

      fnc: 'changeBasket',

      aid: datapoint,  // Produkt-ID

      anid: datapoint, // Produkt-ID

      am: '1',

      response: 'true'

    });



    return fetch(url, {

      method: 'POST',

      headers: headers,

      body: body

    })

    .then(response => response.text())

    .then(result => {

      console.log(`Produkt ${datapoint} erfolgreich hinzugefügt:`, result);

    })

    .catch(error => {

      console.error(`Fehler beim Hinzufügen von Produkt ${datapoint}:`, error);

    });

  });


    // Warte, bis alle Fetch-Requests abgeschlossen sind
    await Promise.all(fetchPromises);

    // Füge hier die Verzögerung von einer Sekunde ein, bevor die Seite neu geladen wird
    setTimeout(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.reload(tabs[0].id);
        });
    }, 1000);  // Verzögerung von 1000 Millisekunden (1 Sekunde)
}