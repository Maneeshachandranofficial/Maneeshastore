// One-time migration: string category/subCategory  ->  reference taxonomy.
// Non-destructive: legacy string fields are kept untouched for rollback.
// Run:  node migrate-taxonomy.mjs
import { createClient } from 'next-sanity';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => {
    const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  })
);
const token = env.SANITY_API_WRITE_TOKEN;
if (!token) { console.error('Missing SANITY_API_WRITE_TOKEN in .env.local'); process.exit(1); }

const client = createClient({ projectId: 'sx7pny5k', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token });

// Existing category docs, so we UPDATE rather than duplicate them.
const existing = await client.fetch('*[_type=="category"]{_id, id}');
const idToDocId = Object.fromEntries(existing.filter((d) => d.id).map((d) => [d.id, d._id]));

// Ensure a category doc exists (patch if present, create if not). Returns its _id.
async function ensureCat(slug, name, extra = {}) {
  if (idToDocId[slug]) {
    const _id = idToDocId[slug];
    await client.patch(_id).set({ name, id: slug, ...extra }).commit();
    console.log('  updated', slug, '->', _id);
    return _id;
  }
  const _id = `category.${slug}`;
  await client.createOrReplace({ _id, _type: 'category', name, id: slug, ...extra });
  idToDocId[slug] = _id;
  console.log('  created', slug, '->', _id);
  return _id;
}

console.log('1) Top-level categories');
const brideId = await ensureCat('bride', 'Bride', { showInNav: true, navOrder: 1, isCollection: false });
const groomId = await ensureCat('groom', 'Groom', { showInNav: true, navOrder: 2, isCollection: false });
const ethnicId = await ensureCat('ethnic', 'Ethnic', { showInNav: true, navOrder: 3, isCollection: false });
const celebId = await ensureCat('celebrities', 'Celebrities', { showInNav: true, navOrder: 4, isCollection: false });
const kidsId = await ensureCat('kids', 'Kids', { showInNav: false, navOrder: 5, isCollection: false });

console.log('2) Sub-categories');
const ref = (id) => ({ _type: 'reference', _ref: id });
const girlsId = await ensureCat('girls', 'Girls', { parent: ref(kidsId), navOrder: 1 });
const boysId = await ensureCat('boys', 'Boys', { parent: ref(kidsId), navOrder: 2 });
const ethnicWomenId = await ensureCat('ethnic-women', 'Women', { parent: ref(ethnicId), navOrder: 1 });

console.log('3) Products');
// legacy string category -> { cat: <top-level docId>, subBy: { <legacy subCategory>: <sub docId> } }
const MAP = {
  bride: { cat: brideId, subBy: {} },
  groom: { cat: groomId, subBy: {} },
  ethnic: { cat: ethnicId, subBy: { women: ethnicWomenId } },
  girls: { cat: kidsId, subBy: { kids: girlsId } },
  boys: { cat: kidsId, subBy: { kids: boysId } },
};

const products = await client.fetch('*[_type=="product"]{_id, name, category, subCategory}');
let done = 0, skipped = 0;
for (const p of products) {
  const m = MAP[p.category];
  if (!m) { console.log('  ! no mapping for', p.name, `(category="${p.category}")`); skipped++; continue; }
  const patch = client.patch(p._id).set({ categoryRef: ref(m.cat) });
  const subId = m.subBy[p.subCategory];
  if (subId) patch.set({ subCategoryRef: ref(subId) });
  else patch.unset(['subCategoryRef']); // drop noise like "adult"
  await patch.commit();
  done++;
}
console.log(`\nDone. Products patched: ${done}, skipped: ${skipped}`);
