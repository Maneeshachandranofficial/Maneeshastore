import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category & Collection',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'ID (URL slug)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Display Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'isCollection',
      title: 'Is this a Collection?',
      type: 'boolean',
      description: 'Check this if it should appear under Collections (e.g. Onam 26)',
      initialValue: false,
    }),
  ],
})
