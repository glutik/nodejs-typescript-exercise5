import { createHttpClient } from './utils/http-client';
import { createLogger } from './utils/log';
import store from "./store";

const defaultClient = createHttpClient();
const logger = createLogger('client-sample');

export async function makeCalls(baseUrl: string) {
  const entitiesHttpClient = defaultClient.defaults({
    baseUrl: `${baseUrl}/public/assets`,
  });

  const productsJson = await entitiesHttpClient.get('/products.json');
  const categoriesJson = await entitiesHttpClient.get('/categories.json');
  store.products = productsJson.products;
  store.categories = categoriesJson.categories;
  logger.info(store.products);
  logger.info(store.categories);
}
