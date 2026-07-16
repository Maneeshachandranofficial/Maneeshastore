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
    "collection": collection
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
    "collection": collection
  }
`;
