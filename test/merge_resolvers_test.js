import chai from 'chai';
import mergeResolvers from '../src/merge_resolvers';
import * as clientResolver from './graphql/resolvers/client_resolver';
import * as productResolver from './graphql/resolvers/product_resolver';

const assert = chai.assert;

describe('mergeResolvers', () => {
  describe('with default options', () => {

    it('merges all query resolvers', async () => {

      const resolvers = [clientResolver, productResolver];
      const mergedResolvers = mergeResolvers(resolvers);

      assert.isDefined(mergedResolvers.Query.clients, 'Merged resolvers is missing Query Resolvers');
      assert.isDefined(mergedResolvers.Query.client, 'Merged resolvers is missing Query Resolvers');
      assert.isDefined(mergedResolvers.Query.products, 'Merged resolvers is missing Query Resolvers');
      assert.isDefined(mergedResolvers.Query.product, 'Merged resolvers is missing Query Resolvers');

    });

  });
});