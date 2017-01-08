import { type as productType } from './product_type';

const clientType = `
  type Client {
    id: ID!
    name: String
    age: Int
    products: [Product]
  }
`;

const queries = `
  clients: [Client]
  client(id: ID!): Client
`;

const mutations = `
  create_client(name: String!, age: Int!): Client
  update_client(id: ID!, name: String!, age: Int!): Client
`;

const type = () => [clientType, productType];

export { type, queries, mutations };
