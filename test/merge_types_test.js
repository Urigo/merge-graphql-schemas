import chai from 'chai';
import mergeTypes from '../src/merge_types';
import * as clientType from './graphql/types/client_type';
import * as productType from './graphql/types/product_type';

const assert = chai.assert;

const normalizeWhitespace = (str) => str.replace(/\s+/g,' ').trim();

describe('mergeTypes', () => {
  describe('with default options', () => {

    it('includes schemaType', async () => {

      const types = [clientType, productType];
      const mergedTypes = mergeTypes(types);

      const expectedSchemaType = normalizeWhitespace(`
        schema {
          query: Query,
          mutation: Mutation
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.include(schema, expectedSchemaType, 'Merged Schema is missing schemaType');
    });


    it('includes queryType', async () => {

      const types = [clientType, productType];
      const mergedTypes = mergeTypes(types);

      const expectedQueryType = normalizeWhitespace(`
        type Query {
          clients: [Client]
          client(id: ID!): Client
          products: [Product]
          product(id: ID!): Product
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.include(schema, expectedQueryType, 'Merged Schema is missing queryType');
    });

    it('includes mutationType', async () => {

      const types = [clientType, productType];
      const mergedTypes = mergeTypes(types);

      const expectedMutationType = normalizeWhitespace(`type Mutation {
          create_client(name: String!, age: Int!): Client
          update_client(id: ID!, name: String!, age: Int!): Client
          create_product(description: String!, price: Int!): Product
          update_product(id: ID!, description: String!, price: Int!): Product
        }`);


      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.include(schema, expectedMutationType, 'Merged Schema is missing mutationType');
    });

    it('includes clientType', async () => {

      const types = [clientType, productType];
      const mergedTypes = mergeTypes(types);

      const expectedClientType = normalizeWhitespace(`
        type Client {
          id: ID!
          name: String
          age: Int
          products: [Product]
        }
      `);

      const separateTypes = mergedTypes.slice(1).map((type) => normalizeWhitespace(type));

      assert.include(separateTypes, expectedClientType, 'Merged Schema is missing clientType');
    });

    it('includes productType', async () => {

      const types = [clientType, productType];
      const mergedTypes = mergeTypes(types);

      const expectedProductType = normalizeWhitespace(`
        type Product {
          id: ID!
          description: String
          price: Int
        }
      `);

      const separateTypes = mergedTypes.slice(1).map((type) => normalizeWhitespace(type));

      assert.include(separateTypes, expectedProductType, 'Merged Schema is missing productType');
    });

  });

});
