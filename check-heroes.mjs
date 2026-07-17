import { createClient } from 'next-sanity';

const client = createClient({
  projectId: 'sx7pny5k',
  dataset: 'production',
  apiVersion: '2024-07-16',
  useCdn: false
});

client.fetch('*[_type == "product" && isHero == true]').then(res => console.log(res.map(c => c.name)));
