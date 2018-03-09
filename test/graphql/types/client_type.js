export default `
  type Client {
    id: ID!
    name: String
    age: Int
    dob: Date
    settings: JSON
    products: [Product]
  }

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

  type ClientWithComment {
    # ClientID
    # Second comment line
    # Third comment line
    # Fourth comment line
    id: ID!
    # Name
    name: String
  }

  type Query {
    clients: [Client]
    client(id: ID!): Client
  }

  type Mutation {
    # Creates a new client with their name & age
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

  input ClientFormInputWithComment {
    # Name
    name: String!
    # Age
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
