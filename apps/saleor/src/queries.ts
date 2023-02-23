import gql from 'graphql-tag';
import { Identifiers } from './types';
import { ITEMS_OFFSET } from './constants';
import { getFormattedIdentifiers } from './utils';

export const fetchProductsQuery = (ids?: string[], channelSlug: string = '') => gql`
  {
    products(first: ${ITEMS_OFFSET}, channel:"${channelSlug}", filter: { ids: ${getFormattedIdentifiers(ids)} }) {
      edges {
        node {
          id
          name
          channel
          images {
            url
          }
        }
      }
    }
  }
`;

export const fetchProductVariantsQuery = (
  search: string = '',
  skus?: Identifiers,
  lastCursor: string = '',
  channelSlug: string = ''
) => gql`
  {
    productVariants(first: ${ITEMS_OFFSET}, channel:"${channelSlug}", after: "${lastCursor}", filter: { search: "${search}", sku: ${getFormattedIdentifiers(
  skus
)} } ) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        }
      edges {
        node {
          id
          sku
          name
          images {
            url
          }
          product{
            id
            name
            channel
            images{
              url
            }
          }
        }
      }
    }
  }
`;
