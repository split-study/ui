type Params = {
  id: string | number;
  type: 'Product' | 'ProductVariant';
};

export const formatIdToShopifyGID = ({ id, type }: Params) => {
  const shopifyGIDStart = 'gid://shopify';

  const isShopifyGID = String(id).startsWith(shopifyGIDStart);

  if (isShopifyGID) {
    return String(id);
  }

  return `${shopifyGIDStart}/${type}/${id}`;
};
