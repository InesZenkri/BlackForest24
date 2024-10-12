import sqlite3
import json

db_path = 'database.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Init
category_data = {}

cursor.execute("SELECT product, name, weight, price, image_url FROM products")
rows = cursor.fetchall()

# process each row in the result
for row in rows:
    category, name, weight, price, image_url = row

    # init the category
    if category not in category_data:
        category_data[category] = []

    # append more info
    category_data[category].append({
        "name": name,
        "weight": weight,
        "price": price,
        "image_url": image_url
    })

# close
conn.close()

# convert the dictionary to a JSON string
json_data = json.dumps(category_data, indent=4)

with open('../extension/data.json', 'w') as json_file:
    json_file.write(json_data)

print("Data has been converted to JSON and saved as data.json")
