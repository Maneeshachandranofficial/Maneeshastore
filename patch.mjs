import { createClient } from 'next-sanity';

const token = process.env.SANITY_API_WRITE_TOKEN || 'skdbD7IJQ2DdO0QyOsLA0XKkFrYIy74xuRXZhZ5bi2o2FCy7anhmPxWwKQHJF0TyZQv3SzxQcLgVCAcq3syZ0ndf8TlyNUa9PvjmIx0nhB7LS4hYs15ypjxC531EoiNJKaT2aEsiqYa1yaunLTpqVgW55SXXbu3UsLuRtoW1lGXWTruLofJB';

const client = createClient({
  projectId: 'sx7pny5k',
  dataset: 'production',
  apiVersion: '2024-07-16',
  useCdn: false,
  token: token,
});

const productsList = [
  { id: 27, collection: 'onam-2026-chaayam' },
  { id: 28, collection: 'eves-garden-2024' },
  { id: 29, collection: 'parinaya-2026' },
  { id: 30, collection: 'signature-couture' },
  { id: 31, collection: 'signature-couture' },
  { id: 32, collection: 'signature-couture' }
];

const categoriesAndCollections = [
  { id: 'bride', name: 'Bride', description: 'Curated elegance for the modern bride. Hand-stitched with love.', isCollection: false },
  { id: 'groom', name: 'Groom', description: 'Regal and timeless ethnic wear for the modern groom.', isCollection: false },
  { id: 'kids', name: 'Kids', description: 'Playful yet traditional outfits for the little ones.', isCollection: false },
  { id: 'onam-2026-chaayam', name: 'Onam 2026 Chaayam', description: 'A vibrant celebration of tradition and modern elegance, featuring our signature handloom weaves.', isCollection: true },
  { id: 'eves-garden-2024', name: 'Eves Garden 2024', description: 'Inspired by the purity and grace of nature, perfect for Christian weddings.', isCollection: true },
  { id: 'parinaya-2026', name: 'Parinaya 2026', description: 'The quintessential Hindu bridal collection, rich with gold accents and auspicious colors.', isCollection: true },
  { id: 'signature-couture', name: 'Signature Couture', description: 'Our highest tier of bespoke design, pushing the boundaries of traditional craftsmanship.', isCollection: true }
];

async function run() {
  console.log('Creating categories and collections...');
  for (const cat of categoriesAndCollections) {
    await client.create({
      _type: 'category',
      ...cat
    });
    console.log('Created:', cat.name);
  }

  console.log('Patching products with collection data...');
  // Find products by their ID field (e.g. "27")
  const sanityProducts = await client.fetch('*[_type == "product"]{_id, id}');
  
  for (const prod of sanityProducts) {
    const localMatch = productsList.find(p => p.id.toString() === prod.id);
    if (localMatch) {
      await client.patch(prod._id)
        .set({ collection: localMatch.collection })
        .commit();
      console.log('Patched product ID:', prod.id, 'with collection', localMatch.collection);
    }
  }
  
  console.log('Done!');
}

run().catch(console.error);
