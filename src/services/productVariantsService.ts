import { httpClient } from '../http';
import { ProductVariant } from '../types';

export const getProductVariantsByProductId = (productId: string) => {
  return httpClient.post<void, ProductVariant[]>('/product-variants', {
    productId,
  });
};

export const updateProductVariant = (
  productId: string,
  variants: { id: string; price: string }[],
) => {
  return httpClient.put<void, ProductVariant[]>('/product-variants/update', {
    productId,
    variants,
  });
};
