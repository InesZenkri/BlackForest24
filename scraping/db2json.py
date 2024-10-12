import sqlite3
import json

# Connect to the database file
db_path = 'data.db'  # Update with your database file path
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Initialize an empty dictionary to hold the structured data
category_data = {}

# Query to select relevant columns from the products table
cursor.execute("SELECT product, name, weight, price, image_url FROM products")
rows = cursor.fetchall()

# Process each row in the result set
for row in rows:
    category, name, weight, price, image_url = row

    # Initialize the category if it does not exist
    if category not in category_data:
        category_data[category] = []

    # Append product details to the category
    category_data[category].append({
        "name": name,
        "weight": weight,
        "price": price,
        "image_url": image_url
    })

# Close the database connection
conn.close()

# Convert the dictionary to a JSON string
json_data = json.dumps(category_data, indent=4)

# Save the JSON data to a file
with open('data.json', 'w') as json_file:
    json_file.write(json_data)

print("Data has been converted to JSON and saved as data.json")
