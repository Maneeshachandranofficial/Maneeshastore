import { defineField, defineType } from 'sanity'

// A single, self-referencing taxonomy type the client fully owns.
//  • Top-level entry (no Parent)  = a Category  → can appear in the nav bar.
//  • Entry WITH a Parent          = a Sub-category → becomes a filter tab
//                                    inside that category's page.
// Adding "Celebrities", "Kurtha Sets", "Blazer Sets", etc. is just creating
// a new entry here — the nav bar and filter tabs update themselves.
export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Display Name',
      type: 'string',
      description: 'What shows on the site, e.g. "Bride", "Celebrities", "Kurtha Sets".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'id',
      title: 'URL Slug',
      type: 'string',
      description: 'Used in the web address (lowercase, hyphens, no spaces) e.g. "celebrities", "kurtha-sets". Must be unique.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Leave EMPTY to make this a main Category (can show in the nav bar). Pick a parent to make this a Sub-category (a filter tab inside that category).',
      // A parent must itself be a top-level category (avoid nesting sub-categories)
      options: { filter: '!defined(parent)' },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional intro text shown at the top of the category page.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional. Used where a category needs a picture (e.g. a homepage card).',
    }),
    defineField({
      name: 'showInNav',
      title: 'Show in top navigation bar',
      type: 'boolean',
      description: 'Turn ON to show this main category as a link in the top nav bar. (Only applies to main categories, not sub-categories.)',
      initialValue: false,
      hidden: ({ parent }) => Boolean(parent?.parent),
    }),
    defineField({
      name: 'navOrder',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first (in the nav bar and in filter tabs). e.g. 1, 2, 3…',
      initialValue: 100,
    }),
    defineField({
      name: 'isCollection',
      title: 'Is this a Collection?',
      type: 'boolean',
      description: 'Check this if it should appear under the "Collections" menu (e.g. Onam 2026) rather than as a normal category.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { name: 'name', slug: 'id', parentName: 'parent.name', showInNav: 'showInNav', isCollection: 'isCollection', media: 'image' },
    prepare({ name, slug, parentName, showInNav, isCollection, media }) {
      const bits = [
        parentName ? `↳ sub-category of ${parentName}` : 'Main category',
        isCollection ? 'Collection' : null,
        showInNav && !parentName ? '★ in nav' : null,
      ].filter(Boolean)
      return { title: name || slug, subtitle: bits.join('  ·  '), media }
    },
  },
})
