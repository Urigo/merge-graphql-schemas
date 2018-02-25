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
    deleteClient(id: ID!): Client
  }
`;
