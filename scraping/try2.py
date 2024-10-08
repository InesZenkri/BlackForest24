import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import csv
import json
import re

# Function to fetch user preferences from the API
def get_user_preferences_from_api():
    try:
        response = requests.get('http://127.0.0.1:5000/preferences')
        return response.json()
    except Exception as e:
        print("Error fetching preferences:", e)
        return None

# Fetch preferences
preferences = get_user_preferences_from_api()

driver = webdriver.Chrome()

# Example query
query = "milch"
url = f"https://www.edeka24.de/#search:query={query}"
driver.get(url)

# Allow the page to load completely
time.sleep(5)

products = []
product_elements = driver.find_elements(By.CLASS_NAME, "product-item")

for product in product_elements:
    name_element = product.find_element(By.CLASS_NAME, "title")
    name = name_element.text.strip()
    product_url = name_element.get_attribute("href").strip()

    # Extract price
    price = product.find_element(By.CLASS_NAME, "price").text.strip()

    # Extract weight from the name
    match = re.search(r'(\d+)\s*(kg|g|KG|G|ml|ML|l|L)$', name)
    if match:
        weight = match.group(1)
        unit = match.group(2)
        weight = f"{weight} {unit}"
        name = re.sub(r'(\d+)\s*(kg|g|KG|G|ml|ML|l|L)$', '', name).strip()
    else:
        weight = "N/A"

    # Check if the product is Bio
    bio_elements = product.find_elements(By.CLASS_NAME, "bio")
    bio = "Bio" if bio_elements else "Non-Bio"

    # Filter products based on preferences
    if preferences and preferences.get('bioProducts') and bio == "Non-Bio":
        continue  # Skip non-bio products if bio preference is set

    products.append([name, price, bio, weight, product_url])

# Save to CSV
with open('edeka_products.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['Name', 'Price', 'Bio Classification', 'Weight', 'Product URL'])
    writer.writerows(products)

# Save data to JSON file
with open('edeka_products.json', 'w') as jsonfile:
    json.dump(products, jsonfile)

# Close the browser
driver.quit()

print("Data saved to edeka_products.csv and edeka_products.json")
