import { DialogExtensionSDK, FieldExtensionSDK } from '@contentful/app-sdk';
import { setup, renderSkuPicker } from '@contentful/ecommerce-app-base';
import { dialogConfig, DIALOG_ID, SKUPickerConfig, strings, CHANNEL_SLUG } from './constants';

import PaginatedFetcher from './PaginatedFetcher';
import { ClientConfig, Identifiers } from './types';

const makeCTA = (fieldType: string) => {
  return fieldType === 'Array' ? strings.selectProducts : strings.selectProduct;
};

const validateParameters = (parameters: ClientConfig): string | null => {
  if (parameters.apiEndpoint.length < 1) {
    return 'Missing API Endpoint';
  }
  if (parameters.channelSlug.length < 1) {
    return 'Missing channel slug';
  }

  return null;
};

const createContainer = () => {
  const container = document.createElement('div');
  container.id = DIALOG_ID;
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  document.body.appendChild(container);
};

const renderDialog = async (sdk: DialogExtensionSDK) => {
  createContainer();
  const invocation = sdk.parameters.invocation as any;
  const installation = sdk.parameters.installation;

  const fetcherArgs = {apiEndpoint:installation.apiEndpoint , channelSlug: invocation.channelSlug || installation.channelSlug}
  const fetcher = new PaginatedFetcher( fetcherArgs as ClientConfig);

  renderSkuPicker(DIALOG_ID, {
    sdk,
    fetchProductPreviews: fetcher.getProductsAndVariantsByIdOrSKU,
    fetchProducts: fetcher.getVariantsWithProducts,
  });

  sdk.window.startAutoResizer();
};

const openDialog = async (sdk: FieldExtensionSDK, currentValue: any, parameters: ClientConfig) => {
  const channelField = sdk.entry.fields[CHANNEL_SLUG];
  const channelFieldValue:string = channelField?.getValue();
  const skus = await sdk.dialogs.openCurrentApp({
    title: makeCTA(sdk.field.type),
    // @ts-expect-error Incompatible types
    parameters: channelFieldValue? {...parameters, channelSlug: channelFieldValue} : parameters,
    ...dialogConfig,
  });

  return Array.isArray(skus) ? skus : [];
};

const fetchProductPreviews = (identifiers: Identifiers, config: ClientConfig) =>
  new PaginatedFetcher(config).getProductsAndVariantsByIdOrSKU(identifiers);

const config = {
  ...SKUPickerConfig,
  makeCTA,
  isDisabled: () => false,
  fetchProductPreviews,
  renderDialog,
  openDialog,
  validateParameters,
};

// @ts-ignore in order to keep ClientConfig type instead of sku apps' Record<string, string>
setup(config);
