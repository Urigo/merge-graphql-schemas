import validateSchema from '../src/validate_schema';

describe('validateSchema', () => {
  describe('with default options', () => {
    const validSchema = `schema {
      query: Query,
      mutation: Mutation
    }

    type Query {
       clients: [Client]
    }

    type Mutation {
       create_client(name: String!, age: Int!): Client
    }`;

    const validCustomTypes = [
      'type Client {\n    id: ID!\n    name: String\n    age: Int\n    products: [Product]\n  }',
    ];

    it('it throws error when schema is invalid', () => {
      const badSchema = `schema {
          query: Query,
          mutation: Mutation
        }

        type Query {
           clients:
        }

        type Mutation {
           create_client(name: String!, age: Int!): Client
        }`;

      expect(() => validateSchema(badSchema, validCustomTypes)).toThrow(Error);
      expect(() => validateSchema(badSchema, validCustomTypes)).toThrow('Syntax Error GraphQL');
    });

    it('it throws error when a customType is invalid', () => {
      const badCustomTypes = [
        'type Client {\n    id: ID!\n    name:\n    age: Int\n    products: [Product]\n  }',
      ];

      expect(() => validateSchema(validSchema, badCustomTypes)).toThrow(Error);
      expect(() => validateSchema(validSchema, badCustomTypes)).toThrow('Syntax Error GraphQL');
    });
  });
});
