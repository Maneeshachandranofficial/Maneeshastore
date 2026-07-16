import os
import shutil
import glob

source_dir = r"c:\Users\anxdh\OneDrive\Desktop\maneesha\webapp\public\final_images"
dest_dir = r"c:\Users\anxdh\OneDrive\Desktop\maneesha\webapp\public\drive_images_categorised"

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)
else:
    for filename in os.listdir(dest_dir):
        file_path = os.path.join(dest_dir, filename)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            pass

extensions = ('*.png', '*.jpg', '*.jpeg', '*.webp', '*.PNG', '*.JPG', '*.JPEG')
files = []
for ext in extensions:
    files.extend(glob.glob(os.path.join(source_dir, '**', ext), recursive=True))

category_counts = {}

for file_path in files:
    path_parts = file_path.split(os.sep)
    category = "general"
    
    lower_parts = [p.lower() for p in path_parts]
    
    if any("bride" in p for p in lower_parts): category = "bridal"
    elif any("groom" in p for p in lower_parts): category = "bridal"
    elif any("ethnic" in p for p in lower_parts): category = "ethnic"
    elif any("kid" in p for p in lower_parts): category = "kids"
    elif any("semi" in p for p in lower_parts) or any("party" in p for p in lower_parts): category = "semi_party"
    elif any("celeb" in p for p in lower_parts): category = "celebrities"
    elif any("collection" in p for p in lower_parts): category = "collections"
    
    if category not in category_counts:
        category_counts[category] = 1
    else:
        category_counts[category] += 1
        
    ext = os.path.splitext(file_path)[1].lower()
    new_filename = f"{category}_{category_counts[category]}{ext}"
    dest_path = os.path.join(dest_dir, new_filename)
    
    try:
        shutil.copy2(file_path, dest_path)
    except:
        pass

print("Finished organizing images. Counts:")
for cat, count in category_counts.items():
    print(f"{cat}: {count} images")
