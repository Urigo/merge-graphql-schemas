export default `
  type Client {
    id: ID!
    name: String
    age: Int
  }
  type Query {
    getClient(id: ID!): Client
  }
  type Query {
    getClient(id: ID!): Boolean
    deleteClient(id: ID!): Client
  }
`;
