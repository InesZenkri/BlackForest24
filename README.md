# BlackForest24

A Chrome extension and Python scrapers around EDEKA product data: scrape products from EDEKA online shops, store shopping preferences through a small local API, and view scraped products in an in-extension shop page.

The long-term goal is to turn a recipe ingredient list into a filled EDEKA cart; the repo currently contains the prototype building blocks described below.

## What's inside

- `extension/` - Chrome extension (Manifest V3)
  - Popup with preference toggles (Bio, cheapest) plus custom preferences you can add yourself. Preferences are saved via `chrome.storage.sync` and synced to the local API.
  - `shop.html` - an in-extension "My E-Shop" page that lists product data by category with image, weight and price, read from a `data.json` file you provide.
- `scraping/`
  - `api_server.py` - a small Flask server (port 5000) that stores the preferences in `user_preferences.json`.
  - `try.py`, `try2.py` - Selenium scrapers for EDEKA online shops. They extract product name, weight, price, Bio classification and product URLs into CSV/JSON. `try2.py` also applies the saved Bio preference to filter results.
  - `edeka_products.csv` / `edeka_products.json` - sample scraped output.

## Setup

Prerequisites: Python 3, and Google Chrome with a matching ChromeDriver (required by Selenium).

1. Install the Python dependencies:
   ```bash
   pip install flask requests selenium
   ```
2. Start the preferences API from the `scraping/` folder:
   ```bash
   cd scraping
   python api_server.py
   ```
3. Load the extension in Chrome: `chrome://extensions` -> Developer mode -> Load unpacked -> select the `extension/` folder.
4. Run a scraper from the `scraping/` folder after setting the `query` variable to what you want to search for:
   ```bash
   python try2.py
   ```

## Tech

JavaScript (Chrome Extensions, Manifest V3), Python (Selenium, Flask), CSV/JSON.
