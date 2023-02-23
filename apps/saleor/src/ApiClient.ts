import { print } from 'graphql/language/printer';
import { DocumentNode } from 'graphql';
import { fetchProductsQuery, fetchProductVariantsQuery } from './queries';
import { ClientConfig, Identifiers, ProductsData, ProductVariantsData } from './types';

type FetchVariantsParams = {
  search?: string;
  skus?: Identifiers;
  endCursor?: string;
  channelSlug?: string;
};

type FetchProductsParams = {
  productIds?: Identifiers;
   channelSlug?: string;
};

class ApiClient {
  private apiEndpoint: string;
  private channelSlug: string;
  
  constructor({ apiEndpoint, channelSlug }: ClientConfig) {
    this.apiEndpoint = apiEndpoint;
    this.channelSlug = channelSlug
  }

  fetchVariants = async ({
    search,
    skus,
    channelSlug,
    endCursor
  }: FetchVariantsParams): Promise<ProductVariantsData> => {
    const res = await this.fetch(fetchProductVariantsQuery(search, skus, endCursor, channelSlug || this.channelSlug));

    const {
      data: { productVariants }
    } = await res.json();

    return productVariants;
  };

  fetchProducts = async ({ productIds, channelSlug}: FetchProductsParams): Promise<ProductsData> => {
    const res = await this.fetch(fetchProductsQuery(productIds, channelSlug || this.channelSlug));

    const {
      data: { products }
    } = await res.json();

    return products;
  };

  private fetch = (query: DocumentNode) =>
    window.fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: print(query) })
    });
}

export default ApiClient;
