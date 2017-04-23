export default `
  type Client {
    id: ID!
    name: String
    age: Int
    products: [Product]
  }

  type Query {
    clients: [Client]
    client(id: ID!): Client
  }

  type Mutation {
    create_client(name: String!, age: Int!): Client
    update_client(id: ID!, name: String!, age: Int!): Client
  }

  input clientForm {
    name: String!
    age: Int!
  }
`;
