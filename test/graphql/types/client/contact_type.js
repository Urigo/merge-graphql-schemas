export default `
  type Contact {
    id: ID!
    description: String
  }

  type Query {
    contacts: [Contact]
    contact(id: ID!): Contact
  }

  type Mutation {
    create_contact(description: String!): Contact
  }
`;
