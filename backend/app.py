import os
import json
from flask import Flask, jsonify # type: ignore
from flask_cors import CORS  # type: ignore

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains on all routes


# Function to load JSON data
def load_json_data(filepath):
    with open(filepath, 'r') as file:
        return json.load(file)

# Assuming your JSON file is in the same directory as app.py
json_filepath = os.path.join(os.path.dirname(__file__), 'updated-game-data_modified.json')
data = load_json_data(json_filepath)

@app.route('/')
def home():
    return "Flask heroku app"

@app.route('/api')
def home():
    return "Welcome to the API!"

@app.route('/api/characters')
def characters():
    # Return all characters
    return jsonify(data)

@app.route('/api/characters/<name>')
def character(name):
    # Return specific character details
    character_info = data.get(name)
    if character_info:
        return jsonify(character_info)
    else:
        return jsonify({"error": "Character not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
