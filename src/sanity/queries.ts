import { groq } from 'next-sanity';

export const allProductsQuery = groq`
  *[_type == "product"] {
    "id": id,
    "name": name,
    "price": price,
    "numericPrice": numericPrice,
    "image": image.asset->url,
    "categoryId": coalesce(categoryRef->id, category),
    "categoryName": coalesce(categoryRef->name, category),
    "subCategory": subCategoryRef->id,
    "subCategoryName": subCategoryRef->name,
    "sizingType": sizingType,
    "collection": collection,
    "priceOnRequest": priceOnRequest,
    "isHero": isHero
  }
`;

export const categoryByIdQuery = groq`
  *[_type == "category" && id == $id][0] {
    "id": id,
    "name": name,
    "description": description,
    "isCollection": isCollection
  }
`;

export const allCollectionsQuery = groq`
  *[_type == "category" && isCollection == true] {
    "id": id,
    "name": name,
    "description": description,
    "isCollection": isCollection
  }
`;

export const productByIdQuery = groq`
  *[_type == "product" && id == $id][0] {
    "id": id,
    "name": name,
    "price": price,
    "numericPrice": numericPrice,
    "image": image.asset->url,
    "gallery": gallery[].asset->url,
    "categoryId": coalesce(categoryRef->id, category),
    "categoryName": coalesce(categoryRef->name, category),
    "subCategory": subCategoryRef->id,
    "subCategoryName": subCategoryRef->name,
    "sizingType": sizingType,
    "collection": collection,
    "priceOnRequest": priceOnRequest,
    "isHero": isHero
  }
`;

// Main categories to show as links in the top nav bar (client-managed).
export const navCategoriesQuery = groq`
  *[_type == "category" && showInNav == true && !defined(parent) && isCollection != true]
    | order(navOrder asc, name asc) {
      "id": id,
      "name": name
    }
`;

// The sub-categories that belong to a given category (its filter tabs).
export const subCategoriesForQuery = groq`
  *[_type == "category" && defined(parent) && parent->id == $id]
    | order(navOrder asc, name asc) {
      "id": id,
      "name": name
    }
`;

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0] {
    eyebrow,
    heading,
    intro,
    "portrait": portrait.asset->url,
    timelineHeading,
    timeline[]{
      year,
      title,
      description,
      "image": image.asset->url
    }
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    sloganLine1,
    sloganLine2,
    aboutHeading,
    aboutHeadingAccent,
    aboutBody,
    stats[]{ value, label },
    testimonials[]{ quote, name, role },
    phone,
    email,
    instagram,
    calendlyUrl
  }
`;
