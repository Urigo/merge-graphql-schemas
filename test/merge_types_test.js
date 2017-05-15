import chai from 'chai'; // eslint-disable-line
import mergeTypes from '../src/merge_types';
import clientType from './graphql/types/client_type';
import productType from './graphql/types/product_type';
import vendorType from './graphql/types/vendor_type';
import personEntityType from './graphql/types/person_entity_type';
import personSearchType from './graphql/types/person_search_type';
import customType from './graphql/other/custom_type';
import simpleQueryType from './graphql/other/simple_query_type';

const assert = chai.assert;

const normalizeWhitespace = str => str.replace(/\s+/g, ' ').trim();

describe('mergeTypes', function () {
  describe('when no types exist', function () {
    it('returns minimal schema', function () {
      const types = [];
      const mergedTypes = mergeTypes(types);

      const expectedSchemaType = normalizeWhitespace(`
        schema {
          query: Query
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.include(schema, expectedSchemaType, 'Merged Schema is missing schemaType');
    });

    it('returns empty query type', function () {
      const types = [];
      const mergedTypes = mergeTypes(types);

      const expectedSchemaType = normalizeWhitespace(`
        type Query {
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.notInclude(schema, expectedSchemaType, 'Merged Schema is including empty query type');
    });

    it('returns no mutation type', function () {
      const types = [];
      const mergedTypes = mergeTypes(types);

      const expectedSchemaType = normalizeWhitespace(`
        type Mutation {
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.notInclude(schema, expectedSchemaType, 'Merged Schema is including empty mutation type');
    });

    it('returns no subscription type', function () {
      const types = [];
      const mergedTypes = mergeTypes(types);

      const expectedSchemaType = normalizeWhitespace(`
        type Subscription {
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.notInclude(schema, expectedSchemaType, 'Merged Schema is including empty subscription type');
    });
  });

  describe('when only query is specified', function () {
    it('returns minimal schema', function () {
      const types = [simpleQueryType];
      const mergedTypes = mergeTypes(types);

      const expectedSchemaType = normalizeWhitespace(`
        schema {
          query: Query
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.include(schema, expectedSchemaType, 'Merged Schema is missing schemaType');
    });

    it('returns simple query type', function () {
      const types = [simpleQueryType];
      const mergedTypes = mergeTypes(types);

      const expectedSchemaType = normalizeWhitespace(`
        type Query {
          clients: [Client]
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.include(schema, expectedSchemaType, 'Merged Schema is missing simple query type');
    });

    it('returns no mutation type', function () {
      const types = [simpleQueryType];
      const mergedTypes = mergeTypes(types);

      const expectedSchemaType = normalizeWhitespace(`
        type Mutation {
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.notInclude(schema, expectedSchemaType, 'Merged simple Schema is including empty mutation type');
    });

    it('returns no subscription type', function () {
      const types = [simpleQueryType];
      const mergedTypes = mergeTypes(types);

      const expectedSchemaType = normalizeWhitespace(`
        type Subscription {
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.notInclude(schema, expectedSchemaType, 'Merged simple Schema is including empty subscription type');
    });
  });

  describe('when only single custom type is passed', function () {
    it('includes customType', function () {
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

    it('returns minimal schema', function () {
      const types = [customType];
      const mergedTypes = mergeTypes(types);

      const expectedSchemaType = normalizeWhitespace(`
        schema {
          query: Query
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.include(schema, expectedSchemaType, 'Merged Schema is missing schemaType');
    });

    it('returns empty query type', function () {
      const types = [customType];
      const mergedTypes = mergeTypes(types);

      const expectedSchemaType = normalizeWhitespace(`
        type Query {
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.notInclude(schema, expectedSchemaType, 'Merged Schema is missing empty query type');
    });

    it('returns no mutation type', function () {
      const types = [customType];
      const mergedTypes = mergeTypes(types);

      const expectedSchemaType = normalizeWhitespace(`
        type Mutation {
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.notInclude(schema, expectedSchemaType, 'Merged Schema is including empty mutation type');
    });

    it('returns no subscription type', function () {
      const types = [customType];
      const mergedTypes = mergeTypes(types);

      const expectedSchemaType = normalizeWhitespace(`
        type Subscription {
        }
      `);

      const schema = normalizeWhitespace(mergedTypes[0]);

      assert.notInclude(schema, expectedSchemaType, 'Merged Schema is including empty subscription type');
    });
  });

  it('includes schemaType', function () {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);

    const expectedSchemaType = normalizeWhitespace(`
      schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
      }
    `);

    const schema = normalizeWhitespace(mergedTypes[0]);

    assert.include(schema, expectedSchemaType, 'Merged Schema is missing schemaType');
  });

  it('includes queryType', function () {
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

  it('includes mutationType', function () {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);

    const expectedMutationType = normalizeWhitespace(`
      type Mutation {
        create_client(name: String!, age: Int!): Client
        update_client(id: ID!, name: String!, age: Int!): Client
        create_product(description: String!, price: Int!): Product
        update_product(id: ID!, description: String!, price: Int!): Product
      }`);


    const schema = normalizeWhitespace(mergedTypes[0]);

    assert.include(schema, expectedMutationType, 'Merged Schema is missing mutationType');
  });

  it('includes subscriptionType', function () {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);

    const expectedSubscriptionType = normalizeWhitespace(`
      type Subscription {
        activeClients: [Client]
        inactiveClients: [Client]
        activeProducts: [Product]
      }`);

    const schema = normalizeWhitespace(mergedTypes[0]);

    assert.include(schema, expectedSubscriptionType, 'Merged Schema is missing subscriptionType');
  });

  it('includes clientType', function () {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);

    const expectedClientType = normalizeWhitespace(`
      type Client {
        id: ID!
        name: String
        age: Int
        dob: Date
        settings: JSON
        products: [Product]
      }
    `);

    const separateTypes = mergedTypes.slice(1).map(type => normalizeWhitespace(type));

    assert.include(separateTypes, expectedClientType, 'Merged Schema is missing clientType');
  });

  it('includes productType', function () {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);

    const expectedProductType = normalizeWhitespace(`
      type Product {
        id: ID!
        description: String
        price: Int
        tag: TAG
        clients: [Client]
      }
    `);

    const separateTypes = mergedTypes.slice(1).map(type => normalizeWhitespace(type));

    assert.include(separateTypes, expectedProductType, 'Merged Schema is missing productType');
  });

  it('includes first inputType', function () {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);

    const expectedProductType = normalizeWhitespace(`
      input ClientForm {
        name: String!
        age: Int!
      }
    `);

    const separateTypes = mergedTypes.slice(1).map(type => normalizeWhitespace(type));

    assert.include(separateTypes, expectedProductType, 'Merged Schema is missing first inputType');
  });

  it('includes second inputType', function () {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);

    const expectedProductType = normalizeWhitespace(`
      input ClientAgeForm {
        age: Int!
      }
    `);

    const separateTypes = mergedTypes.slice(1).map(type => normalizeWhitespace(type));

    assert.include(separateTypes, expectedProductType, 'Merged Schema is missing second inputType');
  });

  it('includes first product ENUM type', function () {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);

    const expectedEnumType = normalizeWhitespace(`
      enum ProductTypes {
        NEW
        USED
        REFURBISHED
      }
    `);

    const separateTypes = mergedTypes.slice(1).map(type => normalizeWhitespace(type));

    assert.include(separateTypes, expectedEnumType, 'Merged Schema is missing first product ENUM type');
  });

  it('includes second product ENUM type', function () {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);

    const expectedEnumType = normalizeWhitespace(`
      enum ProductPriceType {
        REGULAR
        PROMOTION
        SALE
      }
    `);

    const separateTypes = mergedTypes.slice(1).map(type => normalizeWhitespace(type));

    assert.include(separateTypes, expectedEnumType, 'Merged Schema is missing second product ENUM type');
  });

  it('includes first client ENUM type', function () {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);

    const expectedEnumType = normalizeWhitespace(`
      enum ClientStatus {
        NEW
        ACTIVE
        INACTIVE
      }
    `);

    const separateTypes = mergedTypes.slice(1).map(type => normalizeWhitespace(type));

    assert.include(separateTypes, expectedEnumType, 'Merged Schema is missing first client ENUM type');
  });

  it('includes first client SCALAR type', function () {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);

    const expectedScalarType = normalizeWhitespace(`
      scalar Date
    `);

    const separateTypes = mergedTypes.slice(1).map(type => normalizeWhitespace(type));

    assert.include(separateTypes, expectedScalarType, 'Merged Schema is missing first client Scalar type');
  });

  it('includes second client SCALAR type', function () {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);

    const expectedScalarType = normalizeWhitespace(`
      scalar JSON
    `);

    const separateTypes = mergedTypes.slice(1).map(type => normalizeWhitespace(type));

    assert.include(separateTypes, expectedScalarType, 'Merged Schema is missing second client Scalar type');
  });

  it('includes first product SCALAR type', function () {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);

    const expectedScalarType = normalizeWhitespace(`
      scalar TAG
    `);

    const separateTypes = mergedTypes.slice(1).map(type => normalizeWhitespace(type));

    assert.include(separateTypes, expectedScalarType, 'Merged Schema is missing first product Scalar type');
  });

  it('includes INTERFACE type', function () {
    const types = [clientType, productType, vendorType, personEntityType];
    const mergedTypes = mergeTypes(types);

    const expectedScalarType = normalizeWhitespace(`
      interface PersonEntity {
          name: String
          age: Int
          dob: Date
      }
    `);

    const separateTypes = mergedTypes.slice(1).map(type => normalizeWhitespace(type));

    assert.include(separateTypes, expectedScalarType, 'Merged Schema is missing INTERFACE type');
  });

  it('includes vendor custom type', function () {
    const types = [clientType, productType, vendorType, personEntityType];
    const mergedTypes = mergeTypes(types);

    const expectedScalarType = normalizeWhitespace(`
      type Vendor implements PersonEntity {
        id: ID!
        name: String
        age: Int
        dob: Date
      }
    `);

    const separateTypes = mergedTypes.slice(1).map(type => normalizeWhitespace(type));

    assert.include(separateTypes, expectedScalarType, 'Merged Schema is missing vendor custom type');
  });

  it('includes UNION type', function () {
    const types = [clientType, productType, vendorType, personEntityType, personSearchType];
    const mergedTypes = mergeTypes(types);

    const expectedScalarType = normalizeWhitespace(`
      union personSearch = Client | Vendor
    `);

    const separateTypes = mergedTypes.slice(1).map(type => normalizeWhitespace(type));

    assert.include(separateTypes, expectedScalarType, 'Merged Schema is missing UNION type');
  });
});
