import { createClient } from 'next-sanity';

const token = process.env.SANITY_API_WRITE_TOKEN || 'skdbD7IJQ2DdO0QyOsLA0XKkFrYIy74xuRXZhZ5bi2o2FCy7anhmPxWwKQHJF0TyZQv3SzxQcLgVCAcq3syZ0ndf8TlyNUa9PvjmIx0nhB7LS4hYs15ypjxC531EoiNJKaT2aEsiqYa1yaunLTpqVgW55SXXbu3UsLuRtoW1lGXWTruLofJB';

const client = createClient({
  projectId: 'sx7pny5k',
  dataset: 'production',
  apiVersion: '2024-07-16',
  useCdn: false,
  token: token,
});

async function run() {
  const cats = await client.fetch('*[_type == "category" && id == "onam-2026-chaayam "]');
  for (const cat of cats) {
    await client.patch(cat._id).set({ id: 'onam-2026-chaayam' }).commit();
    console.log('Fixed onam 26 ID space issue!');
  }
}
run();
