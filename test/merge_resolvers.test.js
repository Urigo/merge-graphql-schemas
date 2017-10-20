import mergeResolvers from '../src/merge_resolvers';
import clientResolvers from './graphql/resolvers/client_resolver';
import productResolvers from './graphql/resolvers/product_resolver';
import vendorResolvers from './graphql/resolvers/vendor_resolver';

let mergedResolvers;

describe('mergeResolvers', () => {
  describe('single resolver', () => {
    beforeEach(() => {
      const resolvers = [clientResolvers];
      mergedResolvers = mergeResolvers(resolvers);
    });

    it('merges clients query resolver', () => {
      expect(mergedResolvers.Query.clients).toBeDefined();
    });
  });

  describe('multiple resolvers', () => {
    beforeEach(() => {
      const resolvers = [clientResolvers, productResolvers, vendorResolvers];
      mergedResolvers = mergeResolvers(resolvers);
    });

    it('merges clients query resolver', () => {
      expect(mergedResolvers.Query.clients).toBeDefined();
    });

    it('merges client query resolver', () => {
      expect(mergedResolvers.Query.client).toBeDefined();
    });

    it('merges products query resolver', () => {
      expect(mergedResolvers.Query.products).toBeDefined();
    });

    it('merges product query resolver', () => {
      expect(mergedResolvers.Query.product).toBeDefined();
    });

    it('merges vendors query resolver', () => {
      expect(mergedResolvers.Query.vendors).toBeDefined();
    });

    it('merges create_client mutation resolver', () => {
      expect(mergedResolvers.Mutation.create_client).toBeDefined();
    });

    it('merges update_client mutation resolver', () => {
      expect(mergedResolvers.Mutation.update_client).toBeDefined();
    });

    it('merges create_product mutation resolver', () => {
      expect(mergedResolvers.Mutation.create_product).toBeDefined();
    });

    it('merges update_product mutation resolver', () => {
      expect(mergedResolvers.Mutation.update_product).toBeDefined();
    });

    it('merges Client.products subQuery resolver', () => {
      expect(mergedResolvers.Client.products).toBeDefined();
    });

    it('merges Product.clients subQuery resolver', () => {
      expect(mergedResolvers.Product.clients).toBeDefined();
    });
  });
});
