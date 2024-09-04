import { httpClient } from '../http';
import { GetProductsResponse } from '../types';

export const getProducts = (args?: {
  limit?: number;
  afterCursor?: string | null;
  beforeCursor?: string | null;
}) => {
  const endpoint = '/products';

  const filteredArgs = Object.fromEntries(
    Object.entries(args ?? {}).filter(([_, value]) => !!value),
  );

  const queryString = new URLSearchParams(
    filteredArgs as Record<string, string>,
  ).toString();

  const url = queryString.length > 0 ? `${endpoint}?${queryString}` : endpoint;

  return httpClient.get<void, GetProductsResponse>(url);
};
