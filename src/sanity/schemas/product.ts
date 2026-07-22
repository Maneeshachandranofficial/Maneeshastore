import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'pricing', title: 'Pricing' },
    { name: 'categorisation', title: 'Categorisation' },
    { name: 'display', title: 'Display' },
  ],
  fields: [
    // ---------- Content ----------
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Product Photo',
      type: 'image',
      group: 'content',
      description: 'Upload the main product photo (portrait works best). Drag the hotspot to keep the subject centred when cropped.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'content',
      description: 'Shown on the product detail page beneath the price.',
    }),
    defineField({
      name: 'id',
      title: 'URL Slug',
      type: 'string',
      group: 'content',
      description: 'Used in the web address (e.g. "royal-red-lehenga"). Use lowercase letters and hyphens, no spaces.',
      validation: (Rule) => Rule.required(),
    }),

    // ---------- Pricing ----------
    defineField({
      name: 'priceOnRequest',
      title: 'Contact for Pricing',
      type: 'boolean',
      group: 'pricing',
      description: 'Turn ON for made-to-order / couture pieces with no fixed price. The website will hide the price and show an "Enquire" / consultation button instead.',
      initialValue: false,
    }),
    defineField({
      name: 'price',
      title: 'Display Price',
      type: 'string',
      group: 'pricing',
      description: 'How the price appears on the site, e.g. "₹ 45,000".',
      hidden: ({ parent }) => parent?.priceOnRequest === true,
    }),
    defineField({
      name: 'numericPrice',
      title: 'Numeric Price (for cart total)',
      type: 'number',
      group: 'pricing',
      description: 'The number only (e.g. 45000). Used to calculate the cart total.',
      hidden: ({ parent }) => parent?.priceOnRequest === true,
    }),

    // ---------- Categorisation ----------
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'categorisation',
      options: {
        list: [
          { title: 'Bride', value: 'bride' },
          { title: 'Groom', value: 'groom' },
          { title: 'Ethnic', value: 'ethnic' },
          { title: 'Kids', value: 'kids' },
        ],
      },
    }),
    defineField({
      name: 'subCategory',
      title: 'Sub Category (collection filter tab)',
      type: 'string',
      group: 'categorisation',
      description: 'Controls the filter tabs inside a collection. Eves Garden pieces → Bride or Groom. Onam pieces → Men, Women or Kids.',
      options: {
        list: [
          { title: 'Bride', value: 'bride' },
          { title: 'Groom', value: 'groom' },
          { title: 'Men', value: 'men' },
          { title: 'Women', value: 'women' },
          { title: 'Kids', value: 'kids' },
          { title: 'Adult', value: 'adult' },
        ],
      },
    }),
    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'string',
      group: 'categorisation',
      description: 'Optional — assign this piece to a seasonal collection.',
      options: {
        list: [
          { title: 'None', value: '' },
          { title: 'Onam 2026 Chaayam', value: 'onam-2026-chaayam' },
          { title: 'Eves Garden 2024', value: 'eves-garden-2024' },
          { title: 'Parinaya 2026', value: 'parinaya-2026' },
          { title: 'Signature Couture', value: 'signature-couture' },
        ],
      },
    }),
    defineField({
      name: 'sizingType',
      title: 'Sizing Type',
      type: 'string',
      group: 'categorisation',
      options: {
        list: [
          { title: 'Standard Sizes (S, M, L)', value: 'standard' },
          { title: 'Customise (Bespoke)', value: 'customise' },
          { title: 'One Size / Unstitched', value: 'onesize' },
        ],
      },
      initialValue: 'standard',
    }),

    // ---------- Display ----------
    defineField({
      name: 'isHero',
      title: 'Feature in Homepage Hero Carousel',
      type: 'boolean',
      group: 'display',
      description: 'Turn on to feature this product in the large sliding hero images on the homepage.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      price: 'price',
      media: 'image',
      isHero: 'isHero',
      priceOnRequest: 'priceOnRequest',
      category: 'category',
    },
    prepare({ title, price, media, isHero, priceOnRequest, category }) {
      const priceLabel = priceOnRequest ? 'Contact for Pricing' : price
      return {
        title: title || 'Untitled product',
        subtitle: [category, priceLabel, isHero ? '★ Hero' : null].filter(Boolean).join('  ·  '),
        media,
      }
    },
  },
})
