import { createClient } from 'next-sanity';

const token = process.env.SANITY_API_WRITE_TOKEN || 'skdbD7IJQ2DdO0QyOsLA0XKkFrYIy74xuRXZhZ5bi2o2FCy7anhmPxWwKQHJF0TyZQv3SzxQcLgVCAcq3syZ0ndf8TlyNUa9PvjmIx0nhB7LS4hYs15ypjxC531EoiNJKaT2aEsiqYa1yaunLTpqVgW55SXXbu3UsLuRtoW1lGXWTruLofJB';

const client = createClient({
  projectId: 'sx7pny5k',
  dataset: 'production',
  apiVersion: '2024-07-16',
  useCdn: false,
  token: token,
});

const heroIds = ['4', '2', '5', '12', '29'];

async function run() {
  const products = await client.fetch('*[_type == "product"]');
  for (const prod of products) {
    if (heroIds.includes(prod.id)) {
      await client.patch(prod._id).set({ isHero: true }).commit();
      console.log('Set hero true for:', prod.name);
    } else {
      await client.patch(prod._id).set({ isHero: false }).commit();
    }
  }
}
run();
