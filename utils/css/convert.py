import csv
import json

# Input / output filenames
input_file = "res.csv"
output_file = "res.json"

data = []

with open(input_file, newline="", encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        entry = {
            "filename": row["filename"],
            "prompt": row["scenario"],
            "result": {
                "happy_slapping": int(row["happy_slapping"]),
                "revenge_porn": int(row["revenge_porn"]),
                "racism": int(row["racism"]),
                "body_shaming": int(row["body_shaming"])
            }
        }
        data.append(entry)

# Write to JSON file
with open(output_file, "w", encoding="utf-8") as jsonfile:
    json.dump(data, jsonfile, indent=4, ensure_ascii=False)

print(f"Converted {input_file} → {output_file}")
