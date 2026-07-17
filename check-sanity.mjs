import { createClient } from 'next-sanity';

const client = createClient({
  projectId: 'sx7pny5k',
  dataset: 'production',
  apiVersion: '2024-07-16',
  useCdn: false
});

client.fetch('*[_type == "product"]').then(res => console.log('Found products:', res.length)).catch(console.error);
