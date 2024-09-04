export type Product = {
  id: string;
  title: string;
  description: string;
};

export type ProductVariant = {
  id: string;
  inventoryQuantity: number;
  sku: string;
  title: string;
  price: string;
};

export type GetProductsResponse = {
  products: {
    product: Product;
    cursor: string;
  }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type SearchParams = {
  [key: string]: string | string[] | null;
};
