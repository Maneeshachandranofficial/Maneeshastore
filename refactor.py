import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add addToCart to useCart
content = content.replace(
    'const { cart, setIsCartOpen } = useCart();',
    'const { cart, setIsCartOpen, addToCart } = useCart();'
)

# Function to inject
handle_click = """
  const handleProductClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    if (item.price) {
      addToCart({
        id: Date.now() + Math.random(),
        src: item.src,
        title: item.title,
        category: 'Collection',
        size: 'Custom',
        price: parseInt(item.price.replace(/[^0-9]/g, ''), 10)
      });
    } else {
      document.getElementById('appointment')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
"""

content = content.replace(
    'const { cart, setIsCartOpen, addToCart } = useCart();',
    'const { cart, setIsCartOpen, addToCart } = useCart();\n' + handle_click
)

# We need to find all product cards and replace href="#appointment" with onClick
def replacer(match):
    full_match = match.group(0)
    img_src_match = re.search(r'src="([^"]+)"', full_match)
    title_match = re.search(r'<h4>([^<]+)</h4>', full_match)
    price_match = re.search(r'<p className="price[^>]*>([^<]+)</p>', full_match)
    
    if img_src_match and title_match and price_match:
        src = img_src_match.group(1)
        title = title_match.group(1)
        price_text = price_match.group(1)
        
        is_priced = '₹' in price_text
        price_val = price_text if is_priced else ''
        
        onclick_str = f"onClick={{(e) => handleProductClick(e, {{ src: '{src}', title: '{title}', price: '{price_val}' }})}}"
        
        # Replace the href tag
        new_tag = re.sub(r'href="#appointment"', onclick_str, full_match, count=1)
        # Also change <a> to <button> and </a> to </button> to be semantically correct if we want, but <a> with onClick is fine
        # We will just replace href="#appointment" with href="#" onClick=...
        new_tag = re.sub(r'href="#appointment"', f'href="#" {onclick_str}', full_match, count=1)
        
        return new_tag
        
    return full_match

content = re.sub(r'<a href="#appointment" className="product-card">.*?</a>', replacer, content, flags=re.DOTALL)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
