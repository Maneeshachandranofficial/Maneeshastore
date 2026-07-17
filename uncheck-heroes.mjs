import { createClient } from 'next-sanity';

const token = process.env.SANITY_API_WRITE_TOKEN || 'skdbD7IJQ2DdO0QyOsLA0XKkFrYIy74xuRXZhZ5bi2o2FCy7anhmPxWwKQHJF0TyZQv3SzxQcLgVCAcq3syZ0ndf8TlyNUa9PvjmIx0nhB7LS4hYs15ypjxC531EoiNJKaT2aEsiqYa1yaunLTpqVgW55SXXbu3UsLuRtoW1lGXWTruLofJB';

const client = createClient({
  projectId: 'sx7pny5k',
  dataset: 'production',
  apiVersion: '2024-07-16',
  useCdn: false,
  token: token,
});

const myHeroes = ['Vintage Rose', 'Royal Maroon', 'Parinaya 2026', 'The Parinaya Saree', 'Ivory Dreaming'];

async function run() {
  const products = await client.fetch('*[_type == "product" && isHero == true]');
  for (const prod of products) {
    if (myHeroes.includes(prod.name)) {
      await client.patch(prod._id).set({ isHero: false }).commit();
      console.log('Unset hero for:', prod.name);
    }
  }
}
run();
