import chai from 'chai'; // eslint-disable-line
import mergeTypes from '../src/merge_types';
import clientType from './graphql/types/client_type';
import productType from './graphql/types/product_type';
import customType from './graphql/other/custom_type';

const assert = chai.assert;

const normalizeWhitespace = str => str.replace(/\s+/g, ' ').trim();

describe('mergeTypes', () => {
  describe('when no types exist', () => {
    it('returns minimal schema', async () => {
      const types = [];
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

    it('returns empty query type', async () => {
      const types = [];
      const mergedTypes = mergeTypes(types);

      const expectedSchemaType = normalizeWhitespace(`
        type Query {
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.include(schema, expectedSchemaType, 'Merged Schema is missing empty query type');

    });

    it('returns empty mutation type', async () => {
      const types = [];
      const mergedTypes = mergeTypes(types);

      const expectedSchemaType = normalizeWhitespace(`
        type Mutation {
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.include(schema, expectedSchemaType, 'Merged Schema is missing empty mutation type');

    });
  });

  describe('when only single custom type is passed', () => {
    it('includes customType', async () => {
      const types = [customType];
      const mergedTypes = mergeTypes(types);

      const expectedCustomType = normalizeWhitespace(`
        type Custom {
          id: ID!
          name: String
          age: Int
        }
      `);

      const separateTypes = mergedTypes.slice(1).map(type => normalizeWhitespace(type));

      assert.include(separateTypes, expectedCustomType, 'Merged Schema is missing customType');
    });

    it('returns minimal schema', async () => {
      const types = [customType];
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

    it('returns empty query type', async () => {
      const types = [customType];
      const mergedTypes = mergeTypes(types);

      const expectedSchemaType = normalizeWhitespace(`
        type Query {
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.include(schema, expectedSchemaType, 'Merged Schema is missing empty query type');

    });

    it('returns empty mutation type', async () => {
      const types = [customType];
      const mergedTypes = mergeTypes(types);

      const expectedSchemaType = normalizeWhitespace(`
        type Mutation {
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.include(schema, expectedSchemaType, 'Merged Schema is missing empty mutation type');

    });
  });


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

    const separateTypes = mergedTypes.slice(1).map(type => normalizeWhitespace(type));

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
        clients: [Client]
      }
    `);

    const separateTypes = mergedTypes.slice(1).map(type => normalizeWhitespace(type));

    assert.include(separateTypes, expectedProductType, 'Merged Schema is missing productType');
  });
});
