// Corrective pass: the first migration used custom dotted _ids (category.ethnic)
// which don't index reliably. Recreate those 5 docs with Sanity auto-ids and
// re-point the affected product references. Idempotent-ish (deletes dotted ids first).
import { createClient } from 'next-sanity';
import { readFileSync } from 'fs';

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
const client = createClient({ projectId: 'sx7pny5k', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token: env.SANITY_API_WRITE_TOKEN });
const ref = (id) => ({ _type: 'reference', _ref: id });

// 1) Remove the broken dotted-id docs
for (const _id of ['category.ethnic', 'category.celebrities', 'category.girls', 'category.boys', 'category.ethnic-women']) {
  try { await client.delete(_id); console.log('deleted', _id); } catch (e) { console.log('(skip delete)', _id, e.message); }
}

// 2) Existing category _ids we reuse
const existing = await client.fetch('*[_type=="category" && !defined(parent)]{ "id":id, _id }');
const byId = Object.fromEntries(existing.map((d) => [d.id, d._id]));
const kidsId = byId['kids'];
console.log('kids _id:', kidsId);

// 3) Create top-level with AUTO ids
const ethnic = await client.create({ _type: 'category', id: 'ethnic', name: 'Ethnic', showInNav: true, navOrder: 3, isCollection: false });
const celebrities = await client.create({ _type: 'category', id: 'celebrities', name: 'Celebrities', showInNav: true, navOrder: 4, isCollection: false });
console.log('ethnic ->', ethnic._id, '| celebrities ->', celebrities._id);

// 4) Create sub-categories with AUTO ids
const girls = await client.create({ _type: 'category', id: 'girls', name: 'Girls', parent: ref(kidsId), navOrder: 1 });
const boys = await client.create({ _type: 'category', id: 'boys', name: 'Boys', parent: ref(kidsId), navOrder: 2 });
const ethnicWomen = await client.create({ _type: 'category', id: 'ethnic-women', name: 'Women', parent: ref(ethnic._id), navOrder: 1 });
console.log('girls ->', girls._id, '| boys ->', boys._id, '| ethnic-women ->', ethnicWomen._id);

// 5) Re-point affected products (match by name; bride/groom already point to valid existing docs)
async function point(name, catId, subId) {
  const p = await client.fetch('*[_type=="product" && name==$n][0]{_id}', { n: name });
  if (!p) { console.log('  ! product not found:', name); return; }
  const patch = client.patch(p._id).set({ categoryRef: ref(catId) });
  if (subId) patch.set({ subCategoryRef: ref(subId) }); else patch.unset(['subCategoryRef']);
  await patch.commit();
  console.log('  pointed', name);
}
await point('Gilded Lilies', ethnic._id, ethnicWomen._id);
await point('Festive Mini', kidsId, girls._id);
await point('Little Prince', kidsId, boys._id);

console.log('\nDone.');
