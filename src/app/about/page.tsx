import AboutClient from '@/components/AboutClient';
import { client } from '@/sanity/client';
import { aboutPageQuery } from '@/sanity/queries';

export const revalidate = 60;

export const metadata = {
  title: 'About | Maneesha Chandran',
  description: 'The story and journey of Maneesha Chandran — luxury couture from Kochi.',
};

export default async function AboutPage() {
  let about = null;
  try {
    about = await client.fetch(aboutPageQuery);
  } catch (err) {
    console.error('Sanity fetch error on server:', err);
  }
  return <AboutClient about={about} />;
}
