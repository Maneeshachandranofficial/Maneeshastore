import { groq } from 'next-sanity';

export const allProductsQuery = groq`
  *[_type == "product"] {
    "id": id,
    "name": name,
    "price": price,
    "numericPrice": numericPrice,
    "image": image.asset->url,
    "categoryId": category,
    "subCategory": subCategory,
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
    "categoryId": category,
    "subCategory": subCategory,
    "sizingType": sizingType,
    "collection": collection,
    "priceOnRequest": priceOnRequest,
    "isHero": isHero
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
