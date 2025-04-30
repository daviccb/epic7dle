import os
import json
from flask import Flask, jsonify # type: ignore
from flask_cors import CORS  # type: ignore
from datetime import datetime, timedelta, timezone
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains on all routes


# Function to load JSON data
def load_json_data(filepath):
    with open(filepath, 'r') as file:
        return json.load(file)

# Assuming your JSON file is in the same directory as app.py
json_filepath = os.path.join(os.path.dirname(__file__), 'updated-game-data_modified.json')
data = load_json_data(json_filepath)
# JSON format:
# "Name Name": {
#         "code": "c____",
#         "_id": "name-name",
#         "name": "Name Name",
#         "rarity": # rarity,
#         "attribute": "attribute",
#         "role": "role",
#         "zodiac": "zodiac",
#         "region": "region",
#         "date": "1999",
#         "assets": {
#             "icon": "https://raw.githubusercontent.com/fribbels/Fribbels-Epic-7-Optimizer/main/data/cachedimages/cCODE_s.png",
#             "image": "characterAssets/cCODE_idle_normal.png",
#             "thumbnail": "https://raw.githubusercontent.com/fribbels/Fribbels-Epic-7-Optimizer/main/data/cachedimages/cCODE_l.png",
#             "skin": {
#                 "has": "false",
#                 "icon": "",
#                 "image": "characterAssets/cCODE_s01_idle_normal.png",
#                 "thumbnail": ""
#             }
#         }
#     },

@app.route('/')
def home():
    return "Flask heroku app"

@app.route('/api')
def home2():
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
    
@app.route('/api/daily_solution', methods=['GET'])
def daily_solution():
    # Get the current date (day-level accuracy)
    current_date = datetime.now(timezone.utc).strftime("%Y-%m-%d-%H")
    print(current_date)

    # Use the date as a consistent seed for pseudo-random selection
    random.seed(current_date)

    # Pick a random character for the daily solution
    character_keys = list(data.keys())
    selected_character_key = random.choice(character_keys)

    # Return the selected character's details
    return jsonify(data[selected_character_key])

@app.route('/api/previous_daily_solution', methods=['GET'])
def previous_daily_solution():
    # Calculate yesterday's date (day-level accuracy)
    previous_date = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%d-%H")
    print(previous_date)

    # Use the previous date as a consistent seed for pseudo-random selection
    random.seed(previous_date)

    # Pick a random character for the previous daily solution
    character_keys = list(data.keys())
    selected_character_key = random.choice(character_keys)

    # Return the selected character's details
    return jsonify(data[selected_character_key])

if __name__ == '__main__':
    app.run(debug=True, port=5000)
