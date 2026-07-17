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
