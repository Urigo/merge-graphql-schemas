const type = `
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

export { type, queries, mutations };
