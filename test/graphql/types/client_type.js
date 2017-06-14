export default `
  type Client {
    id: ID!
    name: String
    age: Int
    dob: Date
    settings: JSON
    products: [Product]
  }
  
  type ClientWithComment {
    # ClientID
    id: ID!
    # Name
    name: String
  }

  type Query {
    clients: [Client]
    client(id: ID!): Client
  }

  type Mutation {
    create_client(name: String!, age: Int!): Client
    update_client(id: ID!, name: String!, age: Int!): Client
  }

  type Subscription {
    activeClients: [Client]
    inactiveClients: [Client]
  }

  input ClientForm {
    name: String!
    age: Int!
  }

  input ClientAgeForm {
    age: Int!
  }

  enum ClientStatus {
    NEW
    ACTIVE
    INACTIVE
  }

  scalar Date

  scalar JSON
`;
