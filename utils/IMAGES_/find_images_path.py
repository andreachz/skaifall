import os
import re

# Allowed image extensions
image_extensions = {'.jpg', '.jpeg'}

# List and filter image files (excluding macOS metadata files)
image_files = [
    f for f in os.listdir('.')
    if os.path.isfile(f)
    and not f.startswith('._')
    and os.path.splitext(f)[1].lower() in image_extensions
]

# Function to extract the number before the first underscore
def extract_number(filename):
    match = re.match(r'^(\d+)_', filename)
    return int(match.group(1)) if match else float('inf')  # Push non-matching names to the end

# Sort by the extracted number
image_files.sort(key=extract_number)

# Add prefix to each filename
image_files = [f"./IMAGES/{f}" for f in image_files]

print(image_files)

