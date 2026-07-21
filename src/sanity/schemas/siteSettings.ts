import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'sloganLine1',
      title: 'Homepage Slogan — Line 1',
      type: 'string',
      description: 'e.g. "Timeless Luxury"',
      initialValue: 'Timeless Luxury',
    }),
    defineField({
      name: 'sloganLine2',
      title: 'Homepage Slogan — Line 2 (accent)',
      type: 'string',
      description: 'e.g. "For Timeless Love." — shown in the accent gold colour under line 1',
      initialValue: 'For Timeless Love.',
    }),
    defineField({
      name: 'aboutHeading',
      title: 'About Section Heading',
      type: 'string',
      initialValue: 'Rooted in heritage.',
    }),
    defineField({
      name: 'aboutHeadingAccent',
      title: 'About Section Heading (accent)',
      type: 'string',
      initialValue: 'Crafted for the modern era.',
    }),
    defineField({
      name: 'aboutBody',
      title: 'About Section Body',
      type: 'text',
    }),
    defineField({
      name: 'stats',
      title: 'Atelier Stats (homepage)',
      description: 'The four small statistics shown on the homepage. Leave empty to use defaults.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Value (e.g. "500+")', type: 'string' },
            { name: 'label', title: 'Label (e.g. "Bespoke pieces crafted")', type: 'string' },
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials (homepage)',
      description: 'Client quotes shown on the homepage. Leave empty to use defaults.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'quote', title: 'Quote', type: 'text' },
            { name: 'name', title: 'Client Name', type: 'string' },
            { name: 'role', title: 'Role / Collection (e.g. "Bride, Kochi")', type: 'string' },
          ],
          preview: {
            select: { title: 'name', subtitle: 'role' },
          },
        },
      ],
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram Handle',
      type: 'string',
    }),
    defineField({
      name: 'calendlyUrl',
      title: 'Calendly Booking URL',
      type: 'url',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
