from flask import Flask, jsonify, request
import json
import os

app = Flask(__name__)

# Load user preferences from a JSON file
def load_preferences():
    if os.path.exists('user_preferences.json'):
        with open('user_preferences.json', 'r') as f:
            return json.load(f)
    return {
        'bioProducts': False,
        'cheapestProducts': False,
        'talahon': False
    }

# Save user preferences to a JSON file
def save_preferences(preferences):
    with open('user_preferences.json', 'w') as f:
        json.dump(preferences, f)

@app.route('/preferences', methods=['GET', 'POST'])
def preferences():
    if request.method == 'POST':
        preferences = request.json
        save_preferences(preferences)
        return jsonify({"status": "Preferences saved"}), 200
    else:
        return jsonify(load_preferences()), 200

if __name__ == '__main__':
    app.run(port=5000)
