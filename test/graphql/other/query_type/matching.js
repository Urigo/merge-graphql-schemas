export default `
  type Client {
    id: ID!
    name: String
    age: Int
  }
  type Query {
    getClient(id: ID!): Client!
    deleteClient(id: ID!): Client
  }
  type Query {
    getClient(id: ID!): Client!
    deleteClient(id: ID!): Client
  }
`;
