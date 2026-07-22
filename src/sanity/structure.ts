import type { StructureResolver } from 'sanity/structure'

// Groups Studio content into a friendlier navigation than the default flat
// document list: Products, Hero Carousel picks, Categories & Collections,
// and a singleton Site Settings page for editable homepage copy.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Maneesha Chandran')
    .items([
      S.listItem()
        .title('Products')
        .child(
          S.documentTypeList('product')
            .title('All Products')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),
      S.listItem()
        .title('Homepage Hero Carousel')
        .child(
          S.documentList()
            .title('Hero Carousel Picks')
            .filter('_type == "product" && isHero == true')
        ),
      S.divider(),
      S.listItem()
        .title('Categories & Collections')
        .child(
          S.documentTypeList('category').title('Categories & Collections')
        ),
      S.divider(),
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Homepage & Site Settings')
                .id('siteSettings')
                .child(
                  S.document().schemaType('siteSettings').documentId('siteSettings')
                ),
              S.listItem()
                .title('About Page')
                .id('aboutPage')
                .child(
                  S.document().schemaType('aboutPage').documentId('aboutPage')
                ),
            ])
        ),
    ])
