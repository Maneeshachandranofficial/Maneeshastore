import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Product ID (URL slug)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price String (e.g. "₹ 45,000")',
      type: 'string',
    }),
    defineField({
      name: 'numericPrice',
      title: 'Numeric Price (for cart calculation)',
      type: 'number',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Bride', value: 'bride' },
          { title: 'Groom', value: 'groom' },
          { title: 'Kids', value: 'kids' },
        ]
      }
    }),
    defineField({
      name: 'subCategory',
      title: 'Sub Category',
      type: 'string',
      options: {
        list: [
          { title: 'Adult', value: 'adult' },
          { title: 'Kids', value: 'kids' },
          { title: 'Men', value: 'men' },
          { title: 'Women', value: 'women' },
        ]
      }
    }),
    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: '' },
          { title: 'Onam 2026 Chaayam', value: 'onam-2026-chaayam' },
          { title: 'Eves Garden 2024', value: 'eves-garden-2024' },
          { title: 'Parinaya 2026', value: 'parinaya-2026' },
          { title: 'Signature Couture', value: 'signature-couture' },
        ]
      }
    }),
    defineField({
      name: 'sizingType',
      title: 'Sizing Type',
      type: 'string',
      options: {
        list: [
          { title: 'Standard Sizes (S, M, L)', value: 'standard' },
          { title: 'Customise (Bespoke)', value: 'customise' },
          { title: 'One Size / Unstitched', value: 'onesize' },
        ],
      },
      initialValue: 'standard',
    }),
    defineField({
      name: 'isHero',
      title: 'Show in Homepage Hero Carousel?',
      type: 'boolean',
      description: 'Turn this on to feature this product in the sliding hero images on the homepage.',
      initialValue: false,
    }),
  ],
})
