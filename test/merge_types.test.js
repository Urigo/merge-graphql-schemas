import mergeTypes from '../src/merge_types';
import clientType from './graphql/types/client_type';
import productType from './graphql/types/product_type';
import vendorType from './graphql/types/vendor_type';
import personEntityType from './graphql/types/person_entity_type';
import personSearchType from './graphql/types/person_search_type';
import customType from './graphql/other/custom_type';
import simpleQueryType from './graphql/other/simple_query_type';

const normalizeWhitespace = str => str.replace(/\s+/g, ' ').trim();

describe('mergeTypes', () => {
  describe('when no types exist', () => {
    it('returns minimal schema', () => {
      const types = [];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        schema {
          query: Query
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).toContain(expectedSchemaType);
    });

    it('returns empty query type', () => {
      const types = [];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Query {
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).not.toContain(expectedSchemaType);
    });

    it('returns no mutation type', () => {
      const types = [];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Mutation {
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).not.toContain(expectedSchemaType);
    });

    it('returns no subscription type', () => {
      const types = [];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Subscription {
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).not.toContain(expectedSchemaType);
    });
  });

  describe('when only query is specified', () => {
    it('returns minimal schema', () => {
      const types = [simpleQueryType];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        schema {
          query: Query
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).toContain(expectedSchemaType);
    });

    it('returns simple query type', () => {
      const types = [simpleQueryType];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Query {
          clients: [Client]
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).toContain(expectedSchemaType);
    });

    it('returns no mutation type', () => {
      const types = [simpleQueryType];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Mutation {
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).not.toContain(expectedSchemaType);
    });

    it('returns no subscription type', () => {
      const types = [simpleQueryType];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Subscription {
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).not.toContain(expectedSchemaType);
    });
  });

  describe('when only single custom type is passed', () => {
    it('includes customType', () => {
      const types = [customType];
      const mergedTypes = mergeTypes(types);
      const expectedCustomType = normalizeWhitespace(`
        type Custom {
          id: ID!
          name: String
          age: Int
        }
      `);
      const separateTypes = normalizeWhitespace(mergedTypes);

      expect(separateTypes).toContain(expectedCustomType);
    });

    it('returns minimal schema', () => {
      const types = [customType];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        schema {
          query: Query
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).toContain(expectedSchemaType);
    });

    it('returns empty query type', () => {
      const types = [customType];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Query {
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).not.toContain(expectedSchemaType);
    });

    it('returns no mutation type', () => {
      const types = [customType];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Mutation {
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).not.toContain(expectedSchemaType);
    });

    it('returns no subscription type', () => {
      const types = [customType];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Subscription {
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).not.toContain(expectedSchemaType);
    });
  });

  it('includes schemaType', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedSchemaType = normalizeWhitespace(`
      schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
      }
    `);
    const schema = normalizeWhitespace(mergedTypes);

    expect(schema).toContain(expectedSchemaType);
  });

  it('includes queryType', () => {
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
    const schema = normalizeWhitespace(mergedTypes);

    expect(schema).toContain(expectedQueryType);
  });

  it('includes mutationType', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedMutationType = normalizeWhitespace(`
      type Mutation {
        create_client(name: String!, age: Int!): Client
        update_client(id: ID!, name: String!, age: Int!): Client
        create_product(description: String!, price: Int!): Product
        update_product(id: ID!, description: String!, price: Int!): Product
      }`);
    const schema = normalizeWhitespace(mergedTypes);

    expect(schema).toContain(expectedMutationType);
  });

  it('includes subscriptionType', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedSubscriptionType = normalizeWhitespace(`
      type Subscription {
        activeClients: [Client]
        inactiveClients: [Client]
        activeProducts: [Product]
      }`);
    const schema = normalizeWhitespace(mergedTypes);

    expect(schema).toContain(expectedSubscriptionType);
  });

  it('includes clientType', () => {
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
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedClientType);
  });

  it('includes productType', () => {
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
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedProductType);
  });

  it('includes first inputType', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedProductType = normalizeWhitespace(`
      input ClientForm {
        name: String!
        age: Int!
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedProductType);
  });

  it('includes second inputType', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedProductType = normalizeWhitespace(`
      input ClientAgeForm {
        age: Int!
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedProductType);
  });

  it('includes first product ENUM type', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedEnumType = normalizeWhitespace(`
      enum ProductTypes {
        NEW
        USED
        REFURBISHED
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedEnumType);
  });

  it('includes second product ENUM type', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedEnumType = normalizeWhitespace(`
      enum ProductPriceType {
        REGULAR
        PROMOTION
        SALE
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedEnumType);
  });

  it('includes first client ENUM type', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedEnumType = normalizeWhitespace(`
      enum ClientStatus {
        NEW
        ACTIVE
        INACTIVE
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedEnumType);
  });

  it('includes first client SCALAR type', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedScalarType = normalizeWhitespace(`
      scalar Date
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedScalarType);
  });

  it('includes second client SCALAR type', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedScalarType = normalizeWhitespace(`
      scalar JSON
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedScalarType);
  });

  it('includes first product SCALAR type', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedScalarType = normalizeWhitespace(`
      scalar TAG
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedScalarType);
  });

  it('includes INTERFACE type', () => {
    const types = [clientType, productType, vendorType, personEntityType];
    const mergedTypes = mergeTypes(types);
    const expectedScalarType = normalizeWhitespace(`
      interface PersonEntity {
          name: String
          age: Int
          dob: Date
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedScalarType);
  });

  it('includes vendor custom type', () => {
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
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedScalarType);
  });

  it('includes UNION type', () => {
    const types = [clientType, productType, vendorType, personEntityType, personSearchType];
    const mergedTypes = mergeTypes(types);
    const expectedScalarType = normalizeWhitespace(`
      union personSearch = Client | Vendor
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedScalarType);
  });

  it('preserves the field comments', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedClientType = normalizeWhitespace(`
      type ClientWithComment {
        # ClientID
        # Second comment line
        # Third comment line
        # Fourth comment line
        id: ID!
        # Name
        name: String
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedClientType);
  });

  it('preserves the type comments', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedClientType = normalizeWhitespace(`
      # Comments on top of type definition
      # Second comment line
      # Third comment line
      # Fourth comment line
      type ClientWithCommentOnTop {
        # ClientID
        id: ID!
        # Name
        name: String
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedClientType);
  });
});
