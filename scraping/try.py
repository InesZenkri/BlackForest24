from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import csv
import re  

driver = webdriver.Chrome()

query = "milch"
url = f"https://ec-offenburg.edeka.shop/index.php?stoken=8268F7CC&lang=0&cl=search&searchparam={query}"
driver.get(url)

# Allow the page to load completely
time.sleep(2) 

products = []
product_elements = driver.find_elements(By.CLASS_NAME, "listDetails")
image_elements = driver.find_elements(By.CLASS_NAME, "picture")

# Check if the image container exists and extract the image URL
if image_elements:
    image_element = image_elements[0].find_element(By.TAG_NAME, "img")
    image_url = image_element.get_attribute("src").strip()
for product in product_elements:
    # Extract name and URL
    name_element = product.find_element(By.CLASS_NAME, "title").find_element(By.TAG_NAME, "a")
    full_name = name_element.text.strip()
    product_url = name_element.get_attribute("href").strip()
    
    # Extract price
    price_element = product.find_element(By.CLASS_NAME, "price").find_element(By.CLASS_NAME, "article-price")
    price = price_element.text.split('\n')[0].strip()  # Get the first line which is the price

    # Check if the product is Bio
    bio_elements = product.find_elements(By.CLASS_NAME, "bio")
    bio = "Bio" if bio_elements else "Non-Bio"

    # Use regex to separate name and weight (various units)
    match = re.match(r'^(.*?)(\d+\s*(g|G|kg|KG|l|L|ml|ML))$', full_name)  # Capture name and weight with various units
    if match:
        name = match.group(1).strip()  
        weight = match.group(2).strip() 
    else:
        name = full_name  
        weight = ""  

    # Add data to the list
    products.append([name, weight, price, bio, product_url, image_url])

# Save to CSV
with open('edeka_products.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['Name', 'Weight', 'Price', 'Bio Classification', 'Product URL', 'Image URL'])
    writer.writerows(products)

# Close the browser
driver.quit()

print("Data saved to edeka_products.csv")
