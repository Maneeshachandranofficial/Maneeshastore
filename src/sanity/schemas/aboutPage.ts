import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Small label above heading',
      type: 'string',
      description: 'e.g. "The House"',
      initialValue: 'The House',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'About Maneesha Chandran',
    }),
    defineField({
      name: 'intro',
      title: 'Intro paragraph',
      type: 'text',
      description: 'Shown at the top of the About page.',
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait / feature photo (optional)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'timelineHeading',
      title: 'Timeline section heading',
      type: 'string',
      initialValue: 'The Journey',
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline / Milestones',
      description: 'Add a new entry each time a milestone is reached. Newest or oldest first — they display in this order.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'year', title: 'Year', type: 'string' },
            { name: 'title', title: 'Milestone Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { name: 'image', title: 'Photo (optional)', type: 'image', options: { hotspot: true } },
          ],
          preview: {
            select: { title: 'title', subtitle: 'year', media: 'image' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'About Page' }
    },
  },
})
