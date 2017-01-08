import chai from 'chai';
import mergeTypes from '../src/merge_types';
import * as clientType from './graphql/types/client_type';
import * as productType from './graphql/types/product_type';

const assert = chai.assert;

describe('mergeTypes', () => {
  describe('with default options', () => {

    it('returns merged schema', async () => {

      const types = [clientType, productType];
      const mergedTypes = mergeTypes(types).replace(/ /g,'');

      const clientType = `
        type Client {
          id: ID!
          name: String
          age: Int
          products: [Product]
        }
      `.replace(/ /g,'');

      const productType = `
        type Product {
          id: ID!
          description: String
          price: Int
        }
      `.replace(/ /g,'');

      const queryType = `
        type Query {
          clients: [Client]
          client(id: ID!): Client
          products: [Product]
          product(id: ID!): Product
        }
      `.replace(/ /g,'');

      const mutationType = `type Mutation {
          create_client(name: String!, age: Int!): Client
          update_client(id: ID!, name: String!, age: Int!): Client
          create_product(description: String!, price: Int!): Product
          update_product(id: ID!, description: String!, price: Int!): Product
        }`.replace(/ /g,'');

      assert.include(mergedTypes, clientType, 'Merged Schema is missing clientType');
      assert.include(mergedTypes, productType, 'Merged Schema is missing productType');
      assert.include(mergedTypes, queryType, 'Merged Schema is missing queryType');
      assert.include(mergedTypes, mutationType, 'Merged Schema is missing mutationType');
    });

  });

});