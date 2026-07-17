import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'sx7pny5k',
  dataset: 'production',
  apiVersion: '2024-07-16',
  useCdn: false
});

const query = `
  *[_type == "product"] {
    "id": id,
    "name": name,
    "price": price,
    "numericPrice": numericPrice,
    "image": image.asset->url,
    "categoryId": category,
    "subCategory": subCategory,
    "sizingType": sizingType,
    "collection": collection
  }
`;

client.fetch(query).then(res => {
  console.log('Returned products count:', res.length);
  console.log('Sample product:', res[0]);
}).catch(console.error);
