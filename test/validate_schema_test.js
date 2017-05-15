import chai from 'chai'; // eslint-disable-line
import validateSchema from '../src/validate_schema';

const assert = chai.assert;

describe('validateSchema', function () {
  describe('with default options', function () {
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

    it('it throws error when schema is invalid', function () {
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

      assert.throws(() => validateSchema(badSchema, validCustomTypes), Error, 'Syntax Error GraphQL');
    });

    it('it throws error when a customType is invalid', function () {
      const badCustomTypes = [
        'type Client {\n    id: ID!\n    name:\n    age: Int\n    products: [Product]\n  }',
      ];

      assert.throws(() => validateSchema(validSchema, badCustomTypes), Error, 'Syntax Error GraphQL');
    });
  });
});
