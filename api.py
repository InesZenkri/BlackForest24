from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

@app.route('/api/data', methods=['GET'])
def get_data():
    categories = request.args.getlist('category')
    conn = sqlite3.connect('extension/database.db')
    cursor = conn.cursor()

    if categories:
        query_placeholders = ', '.join('?' for _ in categories)
        query = f"SELECT name, weight, price, bio, product_url, image_url, product AS category FROM products WHERE LOWER(product) IN ({query_placeholders})"
        cursor.execute(query, [category.lower() for category in categories])
    else:
        cursor.execute("SELECT name, weight, price, bio, product_url, image_url, product AS category FROM products")

    data = cursor.fetchall()
    conn.close()

    data = [dict(zip([column[0] for column in cursor.description], row)) for row in data]

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)