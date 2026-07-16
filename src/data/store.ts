export const categories = [
  { id: 'bride', name: 'Bride', image: 'https://storage.googleapis.com/aistudio-v2-dev-usercontent/2026-07-14/195/3639145610/b8bafda30c144fb2bde70c67f401f749/image.png' },
  { id: 'grooms', name: 'Grooms', image: 'https://images.unsplash.com/photo-1613852348851-f7ee8eb8309e?q=80&w=600&auto=format&fit=crop' },
  { id: 'ethnic', name: 'Ethnic', image: 'https://storage.googleapis.com/aistudio-v2-dev-usercontent/2026-07-14/195/3639145610/64dae61c5dd74404abafc78d462dd8a8/image.png' },
  { id: 'semi-party-wear', name: 'Semi-Party Wear', image: 'https://images.unsplash.com/photo-1542289457-acaf81313463?q=80&w=600&auto=format&fit=crop' },
  { id: 'collections', name: 'Collections', image: 'https://storage.googleapis.com/aistudio-v2-dev-usercontent/2026-07-14/195/3639145610/ce4ddc95574c43ba879c78207908dc97/image.png' },
  { id: 'celebrities', name: 'Celebrities', image: 'https://images.unsplash.com/photo-1618385627250-9b375b42d103?q=80&w=600&auto=format&fit=crop' },
];

export const collections = [
  { id: 'onam-2026', name: 'Onam 2026 Chaayam', image: 'https://images.unsplash.com/photo-1611080922841-f093a3de3e3b?q=80&w=600&auto=format&fit=crop' },
  { id: 'eves-garden', name: 'Eves Garden 2024 Christian Wedding', image: 'https://storage.googleapis.com/aistudio-v2-dev-usercontent/2026-07-14/195/3639145610/ce4ddc95574c43ba879c78207908dc97/image.png' },
  { id: 'parinaya-2026', name: 'Parinaya 2026 Hindu Wedding', image: 'https://storage.googleapis.com/aistudio-v2-dev-usercontent/2026-07-14/195/3639145610/b8bafda30c144fb2bde70c67f401f749/image.png' }
];

export const products = [
  // Bride
  {
    id: 'b1',
    categoryId: 'bride',
    name: 'Crimson Silk Bridal Lehenga',
    price: '₹1,50,000',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Bride+01',
    description: 'A timeless crimson silk lehenga with heavy zardozi embroidery.',
    featured: false,
    sizingType: 'customise'
  },
  {
    id: 'b2',
    categoryId: 'bride',
    name: 'Ivory Net Bridal Gown',
    price: '₹2,10,000',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Bride+02',
    description: 'An elegant ivory net gown featuring Swarovski crystals and pearl work.',
    featured: false,
    sizingType: 'customise'
  },
  // Grooms
  {
    id: 'g1',
    categoryId: 'grooms',
    name: 'Maroon Velvet Sherwani',
    price: '₹85,000',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Groom+01',
    description: 'A rich maroon velvet sherwani with subtle gold threadwork.',
    featured: false,
    sizingType: 'customise'
  },
  {
    id: 'g2',
    categoryId: 'grooms',
    name: 'Ivory Raw Silk Kurta Set',
    price: '₹45,000',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Groom+02',
    description: 'A classic ivory raw silk kurta set perfect for daytime functions.',
    featured: false,
    sizingType: 'customise'
  },

  // Ethnic
  {
    id: 'e1',
    categoryId: 'ethnic',
    name: 'Emerald Green Anarkali',
    price: '₹55,000',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Ethnic+01',
    description: 'A flowing emerald green anarkali with gota patti detailing.',
    featured: false,
    sizingType: 'standard'
  },
  {
    id: 'e2',
    categoryId: 'ethnic',
    name: 'Mustard Yellow Sharara',
    price: '₹42,000',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Ethnic+02',
    description: 'A vibrant mustard yellow sharara set, ideal for Haldi ceremonies.',
    featured: false,
    sizingType: 'standard'
  },
  // Semi-Party Wear
  {
    id: 's1',
    categoryId: 'semi-party-wear',
    name: 'Midnight Blue Draped Saree',
    price: '₹35,000',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Semi+Party+01',
    description: 'A chic midnight blue pre-draped saree with a sequined blouse.',
    featured: false,
    sizingType: 'customise'
  },
  {
    id: 's2',
    categoryId: 'semi-party-wear',
    name: 'Champagne Cape Set',
    price: '₹38,000',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Semi+Party+02',
    description: 'An elegant champagne georgette cape set.',
    featured: false,
    sizingType: 'customise'
  },
  // Celebrities
  {
    id: 'c1',
    categoryId: 'celebrities',
    name: 'Bespoke Red Carpet Gown',
    price: 'Price on Request',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Celebrity+01',
    description: 'A custom-designed red carpet gown seen on leading actresses.',
    featured: false,
    sizingType: 'customise'
  },
  {
    id: 'c2',
    categoryId: 'celebrities',
    name: 'Custom Award Show Lehenga',
    price: 'Price on Request',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Celebrity+02',
    description: 'An exclusive custom lehenga created for award season.',
    featured: false,
    sizingType: 'customise'
  },
  
  // Collections - Curated Masterpieces
  // Onam 2026
  {
    id: 'onam-1',
    categoryId: 'onam-2026',
    subCategory: 'women',
    name: 'Onam Ivory Silk Saree',
    price: '₹22,000',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Onam+26+Women',
    description: 'Classic ivory silk saree with traditional golden borders.',
    featured: true,
    sizingType: 'customise'
  },
  {
    id: 'onam-2',
    categoryId: 'onam-2026',
    subCategory: 'men',
    name: 'Onam Contemporary Kurta',
    price: '₹14,500',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Onam+26+Men',
    description: 'A modern take on the traditional men\'s kurta for Onam.',
    featured: true,
    sizingType: 'customise'
  },
  {
    id: 'onam-3',
    categoryId: 'onam-2026',
    subCategory: 'girls',
    name: 'Onam Golden Lehenga for Girls',
    price: '₹34,000',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Onam+26+Girls',
    description: 'A stunning golden lehenga for the festive season.',
    featured: true,
    sizingType: 'customise'
  },
  {
    id: 'onam-4',
    categoryId: 'onam-2026',
    subCategory: 'boys',
    name: 'Boys Maroon Bandhgala',
    price: '₹15,000',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Onam+26+Boys',
    description: 'A sharp bandhgala suit for young boys celebrating Onam.',
    featured: false,
    sizingType: 'customise'
  },
  
  // Parinaya 2026
  {
    id: 'parinaya-1',
    categoryId: 'parinaya-2026',
    name: 'Parinaya Kanjeevaram Saree',
    price: '₹65,000',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Parinaya+26+01',
    description: 'Authentic pure silk Kanjeevaram with intricate temple borders.',
    featured: true,
    sizingType: 'customise'
  },
  {
    id: 'parinaya-2',
    categoryId: 'parinaya-2026',
    name: 'Parinaya Royal Sherwani',
    price: '₹55,000',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Parinaya+26+02',
    description: 'Regal maroon sherwani with antique zardosi handwork.',
    featured: true,
    sizingType: 'customise'
  },
  {
    id: 'parinaya-3',
    categoryId: 'parinaya-2026',
    name: 'Parinaya Bride Reception Gown',
    price: '₹85,000',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Parinaya+26+03',
    description: 'A sweeping reception gown blending traditional elements and modern cuts.',
    featured: true,
    sizingType: 'customise'
  },

  // Eves Garden 2024
  {
    id: 'eves-1',
    categoryId: 'eves-garden',
    name: 'Eves Garden White Gown',
    price: '₹1,25,000',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Eves+Garden+01',
    description: 'Pristine white wedding gown with floral lace applique.',
    featured: true,
    sizingType: 'customise'
  },
  {
    id: 'eves-2',
    categoryId: 'eves-garden',
    name: 'Eves Garden Lace Veil',
    price: '₹25,000',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Eves+Garden+02',
    description: 'Cathedral length veil featuring handcrafted floral edges.',
    featured: true,
    sizingType: 'customise'
  },
  {
    id: 'eves-3',
    categoryId: 'eves-garden',
    name: 'Eves Garden Tuxedo',
    price: '₹48,000',
    image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Eves+Garden+03',
    description: 'Classic black tailored tuxedo for the perfect Christian wedding.',
    featured: false,
    sizingType: 'customise'
  }
];
