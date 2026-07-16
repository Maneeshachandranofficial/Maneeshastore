// Test oracle for CheckoutAction's WhatsApp Link generator
const assert = require('assert');

function getWhatsAppLink(cart, cartSubtotal) {
  const header = 'Hello Maneesha Chandran team, I would like to place an order for the following items:\n\n';
  
  const itemsList = cart.map((item, index) => {
      return `*${index + 1}. ${item.title}*\n- Category: ${item.category}\n- Size: ${item.size || 'One Size'}\n- Price: ₹ ${item.price.toLocaleString('en-IN')}`;
    })
    .join('\n\n');
    
  const footer = `\n\n*Total Value:* ₹ ${cartSubtotal.toLocaleString('en-IN')}\n\nPlease let me know the availability and share payment/delivery details. Thank you!`;
  
  const fullMessage = header + itemsList + footer;
  return `https://wa.me/918072071420?text=${encodeURIComponent(fullMessage)}`;
}

// Case 1: Simple single item
const cart1 = [
  { id: 1, title: 'Test Gown', category: 'bride', size: 'M', price: 95000 }
];
const link1 = getWhatsAppLink(cart1, 95000);
const decoded1 = decodeURIComponent(link1.split('?text=')[1]);
console.log('Decoded message 1:\n', decoded1);
assert.ok(decoded1.includes('*1. Test Gown*'));
assert.ok(decoded1.includes('- Category: bride'));
assert.ok(decoded1.includes('- Size: M'));
assert.ok(decoded1.includes('- Price: ₹ 95,000'));
assert.ok(decoded1.includes('*Total Value:* ₹ 95,000'));

// Case 2: Empty size fallback
const cart2 = [
  { id: 2, title: 'Pearl Set', category: 'groom', size: '', price: 115000 }
];
const link2 = getWhatsAppLink(cart2, 115000);
const decoded2 = decodeURIComponent(link2.split('?text=')[1]);
assert.ok(decoded2.includes('- Size: One Size'));

// Case 3: Multiple items
const cart3 = [
  { id: 1, title: 'Item 1', category: 'bride', size: 'S', price: 50000 },
  { id: 2, title: 'Item 2', category: 'groom', size: 'L', price: 40000 }
];
const link3 = getWhatsAppLink(cart3, 90000);
const decoded3 = decodeURIComponent(link3.split('?text=')[1]);
console.log('Decoded message 3:\n', decoded3);
assert.ok(decoded3.includes('*1. Item 1*'));
assert.ok(decoded3.includes('*2. Item 2*'));
assert.ok(decoded3.includes('*Total Value:* ₹ 90,000'));

console.log('✅ WhatsApp Link generator matches all assertions!');
