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
      title: 'Main Photo (cover)',
      type: 'image',
      group: 'content',
      description:
        'This is the picture that leads. It shows on the home page, the category grids and search results, and it is always the FIRST photo on the product page. To change which picture people see first, replace this one. Portrait works best — drag the hotspot to keep the piece centred when cropped.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'More Photos',
      type: 'array',
      group: 'content',
      of: [{ type: 'image', options: { hotspot: true } }],
      description:
        'Optional. Other angles of the same piece — back, side, close-ups of the work, the drape. On the product page customers move through these with the arrows (or by swiping) in the order shown here, after the main photo. Drag to reorder.',
      options: { layout: 'grid' },
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
      name: 'categoryRef',
      title: 'Category',
      type: 'reference',
      group: 'categorisation',
      to: [{ type: 'category' }],
      description: 'Which main category this piece belongs to (Bride, Groom, Ethnic, Celebrities…). Pick from the categories you created. To add a new one, create a Category with no parent.',
      // Only allow top-level categories here (not sub-categories, not collections)
      options: { filter: '!defined(parent) && isCollection != true' },
    }),
    defineField({
      name: 'subCategoryRef',
      title: 'Sub Category (filter tab)',
      type: 'reference',
      group: 'categorisation',
      to: [{ type: 'category' }],
      description: 'Optional. The sub-section / filter tab inside its category (e.g. Kurtha Set, Blazer Set, Girls). Only sub-categories of the chosen Category are shown.',
      // Show only sub-categories belonging to the chosen Category (falls back to
      // all sub-categories if no category is picked yet).
      options: {
        filter: ({ document }: any) => {
          const catRef = document?.categoryRef?._ref
          if (catRef) {
            return { filter: 'defined(parent) && parent._ref == $catRef', params: { catRef } }
          }
          return { filter: 'defined(parent)' }
        },
      },
    }),
    // --- Legacy string fields (kept, hidden) — safe for the old live site &
    // for rollback. Superseded by categoryRef / subCategoryRef above. ---
    defineField({
      name: 'category',
      title: 'Category (legacy)',
      type: 'string',
      group: 'categorisation',
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'subCategory',
      title: 'Sub Category (legacy)',
      type: 'string',
      group: 'categorisation',
      hidden: true,
      readOnly: true,
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
      category: 'categoryRef.name',
      gallery: 'gallery',
    },
    prepare({ title, price, media, isHero, priceOnRequest, category, gallery }) {
      const priceLabel = priceOnRequest ? 'Contact for Pricing' : price
      // Cover + extras, so it's obvious which pieces still need more angles.
      const photoCount = (media ? 1 : 0) + (gallery?.length || 0)
      const photoLabel = photoCount > 1 ? `${photoCount} photos` : '1 photo'
      return {
        title: title || 'Untitled product',
        subtitle: [category, priceLabel, photoLabel, isHero ? '★ Hero' : null]
          .filter(Boolean)
          .join('  ·  '),
        media,
      }
    },
  },
})
