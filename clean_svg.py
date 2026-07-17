import re
with open('logo.svg', 'r') as f:
    svg = f.read()

# Remove the background rect
svg = re.sub(r'<path[^>]*fill="#521618"/>', '', svg)

with open('public/logo.svg', 'w') as f:
    f.write(svg)
print("Cleaned SVG saved to public/logo.svg")
