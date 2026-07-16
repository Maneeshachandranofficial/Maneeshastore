import { createClient } from 'next-sanity';
import fs from 'fs';
import path from 'path';

// Define the static products (we copy this from products.ts to avoid complex TS importing in this raw JS script)
const products = [
  { id: 1, src: '/drive_images_categorised/bridal_1.png', title: 'The Royal Red', price: '₹ 85,000', requiresSize: true, sizes: ['S', 'M', 'L', 'XL'], category: 'groom' },
  { id: 2, src: '/drive_images_categorised/bridal_2.png', title: 'Vintage Rose', price: '₹ 95,000', requiresSize: true, sizes: ['S', 'M', 'L'], category: 'bride' },
  { id: 3, src: '/drive_images_categorised/bridal_3.png', title: 'Pearl Encrusted', price: '₹ 1,15,000', requiresSize: false, category: 'groom' },
  { id: 4, src: '/drive_images_categorised/bridal_4.png', title: 'The Parinaya Saree', price: '₹ 1,15,000', requiresSize: true, sizes: ['M', 'L'], category: 'bride' },
  { id: 5, src: '/drive_images_categorised/bridal_5.png', title: 'Ivory Dreaming', price: '₹ 1,25,000', requiresSize: false, category: 'bride' },
  { id: 6, src: '/drive_images_categorised/bridal_6.png', title: 'Kasavu Bridal Set', price: '₹ 65,000', requiresSize: true, sizes: ['S', 'M', 'L', 'XL'], category: 'bride' },
  { id: 7, src: '/drive_images_categorised/bridal_7.png', title: 'Ivory Lehenga', price: '₹ 95,000', requiresSize: true, sizes: ['S', 'M', 'L'], category: 'bride' },
  { id: 8, src: '/drive_images_categorised/bridal_8.png', title: 'Gold Tissue Saree', price: '₹ 78,000', requiresSize: false, category: 'bride' },
  { id: 9, src: '/drive_images_categorised/bridal_9.png', title: 'Regal Crimson', price: '₹ 1,05,000', requiresSize: true, sizes: ['M', 'L', 'XL'], category: 'bride' },
  { id: 10, src: '/drive_images_categorised/bridal_10.png', title: 'Temple Gold Set', price: '₹ 88,000', requiresSize: true, sizes: ['S', 'M', 'L'], category: 'bride' },
  { id: 11, src: '/drive_images_categorised/bridal_11.png', title: 'Blush Bridal', price: '₹ 72,000', requiresSize: false, category: 'bride' },
  { id: 12, src: '/drive_images_categorised/bridal_12.png', title: 'Royal Maroon', price: '₹ 1,35,000', requiresSize: true, sizes: ['M', 'L'], category: 'bride' },
  { id: 13, src: '/drive_images_categorised/ethnic_1.png', title: 'Golden Threads', price: '₹ 42,000', requiresSize: true, sizes: ['S', 'M', 'L', 'XL'], category: 'bride' },
  { id: 14, src: '/drive_images_categorised/ethnic_2.png', title: 'Kanchipuram Silk', price: '₹ 55,000', requiresSize: true, sizes: ['M', 'L'], category: 'groom' },
  { id: 15, src: '/drive_images_categorised/ethnic_3.jpg', title: 'Temple Borders', price: '₹ 48,000', requiresSize: true, sizes: ['S', 'M', 'L'], category: 'bride' },
  { id: 16, src: '/drive_images_categorised/ethnic_4.png', title: 'Sage Linen Kurta', price: '₹ 38,000', requiresSize: true, sizes: ['S', 'M', 'L', 'XL'], category: 'groom' },
  { id: 17, src: '/drive_images_categorised/ethnic_5.png', title: 'Ivory Chanderi Saree', price: '₹ 52,000', requiresSize: true, sizes: ['M', 'L'], category: 'bride' },
  { id: 18, src: '/drive_images_categorised/ethnic_6.jpg', title: 'Maroon Muse Kurta', price: '₹ 36,000', requiresSize: true, sizes: ['S', 'M', 'L', 'XL'], category: 'groom' },
  { id: 19, src: '/drive_images_categorised/kids_1.png', title: 'Festive Mini', price: '₹ 12,000', requiresSize: true, sizes: ['2Y', '4Y', '6Y', '8Y'], category: 'girls' },
  { id: 20, src: '/drive_images_categorised/kids_2.png', title: 'Little Prince', price: '₹ 15,000', requiresSize: true, sizes: ['2Y', '4Y', '6Y', '8Y'], category: 'boys' },
  { id: 21, src: '/drive_images_categorised/semi_party_1.png', title: 'Midnight Velvet', price: '₹ 28,000', requiresSize: true, sizes: ['S', 'M', 'L'], category: 'bride' },
  { id: 22, src: '/drive_images_categorised/semi_party_2.jpg', title: 'Emerald Drape', price: '₹ 32,000', requiresSize: true, sizes: ['M', 'L', 'XL'], category: 'bride' },
  { id: 23, src: '/drive_images_categorised/semi_party_3.jpg', title: 'Sapphire Silhouette', price: '₹ 35,000', requiresSize: true, sizes: ['S', 'M', 'L'], category: 'bride' },
  { id: 24, src: '/drive_images_categorised/semi_party_4.png', title: 'Rose Quartz Dress', price: '₹ 25,000', requiresSize: true, sizes: ['S', 'M', 'L', 'XL'], category: 'bride' },
  { id: 25, src: '/drive_images_categorised/semi_party_5.jpg', title: 'Obsidian Kurta Set', price: '₹ 22,000', requiresSize: true, sizes: ['M', 'L'], category: 'groom' },
  { id: 26, src: '/drive_images_categorised/semi_party_6.jpg', title: 'Champagne Ruffles', price: '₹ 45,000', requiresSize: true, sizes: ['S', 'M'], category: 'bride' },
  { id: 27, src: '/drive_images_categorised/collections_1.png', title: 'Onam 2026 Chaayam', price: '₹ 85,000', requiresSize: true, sizes: ['S', 'M', 'L'], category: 'bride', collection: 'onam-2026-chaayam' },
  { id: 28, src: '/drive_images_categorised/collections_2.png', title: 'Eves Garden 2024', price: '₹ 95,000', requiresSize: true, sizes: ['S', 'M', 'L'], category: 'bride', collection: 'eves-garden-2024' },
  { id: 29, src: '/drive_images_categorised/collections_3.png', title: 'Parinaya 2026', price: '₹ 1,15,000', requiresSize: false, category: 'bride', collection: 'parinaya-2026' },
  { id: 30, src: '/drive_images_categorised/collections_4.png', title: 'Gilded Lilies', price: '₹ 75,000', requiresSize: true, sizes: ['S', 'M', 'L', 'XL'], category: 'bride', collection: 'signature-couture' },
  { id: 31, src: '/drive_images_categorised/collections_5.jpg', title: 'Ruby Reverie', price: '₹ 82,000', requiresSize: true, sizes: ['M', 'L'], category: 'bride', collection: 'signature-couture' },
  { id: 32, src: '/drive_images_categorised/collections_6.jpg', title: 'Azure Dreams', price: '₹ 90,000', requiresSize: true, sizes: ['S', 'M', 'L'], category: 'bride', collection: 'signature-couture' }
];

const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId: 'sx7pny5k',
  dataset: 'production',
  apiVersion: '2024-07-16',
  useCdn: false,
  token: token,
});

async function migrate() {
  console.log('Starting Migration of 32 Products...');
  for (const prod of products) {
    try {
      console.log(`Uploading image for: ${prod.title}`);
      
      const filePath = path.join(process.cwd(), 'public', prod.src);
      if (!fs.existsSync(filePath)) {
        console.warn(`Missing file: ${filePath}`);
        continue;
      }

      // Upload the image
      const imageAsset = await client.assets.upload('image', fs.createReadStream(filePath), {
        filename: path.basename(filePath)
      });
      
      const numericPrice = parseInt(prod.price.replace(/[^\d]/g, ''), 10);
      
      // Determine sizingType based on requiresSize and size array presence
      let sizingType = 'standard';
      if (!prod.requiresSize) {
        sizingType = 'onesize';
      }

      const newProduct = {
        _type: 'product',
        id: prod.id.toString(),
        name: prod.title,
        price: prod.price,
        numericPrice: numericPrice,
        category: prod.category,
        subCategory: prod.category === 'girls' || prod.category === 'boys' ? 'kids' : 'adult',
        sizingType: sizingType,
        image: {
          _type: 'image',
          asset: {
            _type: "reference",
            _ref: imageAsset._id
          }
        }
      };

      await client.create(newProduct);
      console.log(`✅ Created Product: ${prod.title}`);
    } catch (err) {
      console.error(`Failed on ${prod.title}:`, err);
    }
  }
  console.log('Migration Complete!');
}

migrate();
