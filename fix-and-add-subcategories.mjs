// Fix Maneesha's broken taxonomy + add the requested sub-categories.
// - Restore `bride` to a top-level category (she nested it under a stray "lehangas").
// - Delete junk categories lehangas / brides (0 products, no refs).
// - Add sub-categories under Bride, Groom, and the Onam collection.
// Idempotent + uses auto-generated _ids (dotted custom ids don't index reliably).
import { createClient } from 'next-sanity';
import { readFileSync } from 'fs';

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
const c = createClient({ projectId: 'sx7pny5k', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token: env.SANITY_API_WRITE_TOKEN });
const ref = (id) => ({ _type: 'reference', _ref: id });

const BRIDE = '6rm71nnTDOxtgIcQO2VhDb';
const GROOM = '6rm71nnTDOxtgIcQO2VhZO';
const ONAM = 'aq7AUICLogGimJulQA5sWD';
const LEHANGAS_JUNK = 'b23ba625-534e-45b0-a26e-d204a3b7744d';
const BRIDES_JUNK = 'ef8c2f10-5a29-4631-8dc6-d8a63f9333a1';

// 1) Restore Bride as a proper top-level category
console.log('1) Restoring Bride to top-level...');
await c.patch(BRIDE).unset(['parent']).set({ name: 'Bride', showInNav: true, navOrder: 1, isCollection: false }).commit();
console.log('   Bride restored (parent removed, name "Bride", in nav).');

// 2) Delete junk categories (now that bride no longer references lehangas)
console.log('2) Deleting junk categories...');
for (const [id, name] of [[LEHANGAS_JUNK, 'lehangas'], [BRIDES_JUNK, 'brides']]) {
  try { await c.delete(id); console.log(`   deleted "${name}"`); }
  catch (e) { console.log(`   could NOT delete "${name}": ${e.message.split('(trace')[0]}`); }
}

// 3) Add sub-categories (skip any that already exist by slug)
console.log('3) Adding sub-categories...');
const existing = new Set((await c.fetch(`*[_type=="category" && defined(parent)].id`)) || []);
const SUBS = [
  { parent: BRIDE, slug: 'bride-lehengas', name: 'Lehengas', order: 1 },
  { parent: BRIDE, slug: 'bride-saree', name: 'Saree', order: 2 },
  { parent: BRIDE, slug: 'bride-wedding-gown', name: 'Wedding Gown', order: 3 },
  { parent: BRIDE, slug: 'bride-wedding-blouses', name: 'Wedding Blouses', order: 4 },
  { parent: GROOM, slug: 'groom-blazer-sets', name: 'Blazer Sets', order: 1 },
  { parent: GROOM, slug: 'groom-kurtha-shirt-sets', name: 'Kurtha / Shirt Sets', order: 2 },
  { parent: ONAM, slug: 'onam-men', name: 'Men', order: 1 },
  { parent: ONAM, slug: 'onam-women', name: 'Women', order: 2 },
  { parent: ONAM, slug: 'onam-kids', name: 'Kids', order: 3 },
];
for (const s of SUBS) {
  if (existing.has(s.slug)) { console.log(`   (exists) ${s.name}`); continue; }
  const doc = await c.create({ _type: 'category', id: s.slug, name: s.name, parent: ref(s.parent), navOrder: s.order, isCollection: false, showInNav: false });
  console.log(`   created "${s.name}" -> ${doc._id}`);
}

console.log('\nDone.');
