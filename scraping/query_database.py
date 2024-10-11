from flask import Flask, request, render_template
import sqlite3
import urllib.parse

app = Flask(__name__)

# Connect to the database and perform a search
def query_database(search_term):
    conn = sqlite3.connect('edeka_products.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE name LIKE ?", ('%' + search_term + '%',))
    results = cursor.fetchall()
    conn.close()
    return results

def query_product_info(menu_item):
    # Connect to the database
    conn = sqlite3.connect('edeka_products.db')
    cursor = conn.cursor()

    # Execute a SQL query to find the product info for the menu item
    cursor.execute("SELECT * FROM products WHERE name = ?", (menu_item,))
    product_info = cursor.fetchone()

    # Close the database connection
    conn.close()

    # If the product info was found, construct a query URL for the edeka24 website
    if product_info is not None:
        product_name = product_info[0]  # Replace with the correct index for the product name in your database
        query = urllib.parse.quote(product_name)
        url = f"https://www.edeka24.de/#search:query={query}"
        return url

    # If the product info was not found, return None
    return None

@app.route('/search', methods=['POST'])
def search():
    search_term = request.form['search']
    results = query_database(search_term)

    # Display the search results
    response = "<h1>Search Results:</h1><ul>"
    for result in results:
        response += f"<li>{result}</li>"
    response += "</ul>"

    return response

@app.route('/search_edeka24', methods=['POST'])
def search_edeka24():
    menu_item = request.form['menu_item']
    url = query_product_info(menu_item)

    if url is not None:
        return f"<h1>Search Edeka24:</h1><a href='{url}'>{url}</a>"
    else:
        return "<h1>No product found for this menu item.</h1>"



if __name__ == '__main__':
    app.run(debug=True)