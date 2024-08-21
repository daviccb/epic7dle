import json

# Load the original JSON data from the provided file
file_path = 'game-data.json'
with open(file_path, 'r') as file:
    data = json.load(file)

# Extract the required fields for each character
filtered_data = {}
for key, value in data.items():
    filtered_data[key] = {
        "code": value["code"],
        "_id": value["_id"],
        "name": value["name"],
        "rarity": value["rarity"],
        "attribute": value["attribute"],
        "role": value["role"],
        "zodiac": value["zodiac"],
        "region": "",
        "date": "",
        "assets": {
            "icon": value["assets"]["icon"],
            "image": value["assets"]["image"],
            "thumbnail": value["assets"]["thumbnail"]
        }
    }

# Write the filtered data to a new JSON file
filtered_json_path = 'filtered_game_data.json'
with open(filtered_json_path, 'w') as file:
    json.dump(filtered_data, file, indent=2)

print(f"Filtered data saved to {filtered_json_path}")
