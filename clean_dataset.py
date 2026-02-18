import os
from PIL import Image

dataset_path = "dataset"

def clean_folder(folder_path):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                img = Image.open(file_path)
                img.verify()  # Verify image
            except:
                print(f"Removing corrupted file: {file_path}")
                os.remove(file_path)

clean_folder(dataset_path)

print("✅ Dataset cleaned successfully!")
