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
      title: 'Category (e.g. bride, ethnic, grooms)',
      type: 'string',
    }),
    defineField({
      name: 'subCategory',
      title: 'Sub Category (e.g. men, women, girls, boys)',
      type: 'string',
    }),
    defineField({
      name: 'collection',
      title: 'Collection (e.g. onam-2026-chaayam)',
      type: 'string',
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
  ],
})
