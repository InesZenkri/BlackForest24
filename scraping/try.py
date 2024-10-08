from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import csv
import json  # maybe i will switch to json 
import re


driver = webdriver.Chrome()

# just example of query  
query = "milch"
url = f"https://www.edeka24.de/#search:query={query}"
driver.get(url)

# Allow the page to load completely
time.sleep(5)  


products = []
product_elements = driver.find_elements(By.CLASS_NAME, "product-item") #let's hope they dont change the dis class name at last min XD

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
        
        # remove the weight from the name
        name = re.sub(r'(\d+)\s*(kg|g|KG|G|ml|ML|l|L)$', '', name).strip()
    else:
        weight = "N/A"

    # check if the product is Bio
    bio_elements = product.find_elements(By.CLASS_NAME, "bio")
    bio = "Bio" if bio_elements else "Non-Bio"

    products.append([name, price, bio, weight, product_url])

# for now save to CSV 
with open('edeka_products.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['Name', 'Price', 'Bio Classification', 'Weight', 'Product URL'])
    writer.writerows(products)

# save data to JSON file (for the extension to read) still working on it, and for now still doenst work 
with open('edeka_products.json', 'w') as jsonfile:
    json.dump(products, jsonfile)

# close the browser
driver.quit()

print("Data saved to edeka_products.csv and edeka_products.json")
