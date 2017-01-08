const mergeTypes = (types, options) => {

  const merged =  `
    type Client {
      id: ID!
      name: String
      age: Int
      products: [Product]
    }

    type Product {
      id: ID!
      description: String
      price: Int
    }

    type Query {
      clients: [Client]
      client(id: ID!): Client
      products: [Product]
      product(id: ID!): Product
    }

    type Mutation {
      create_client(name: String!, age: Int!): Client
      update_client(id: ID!, name: String!, age: Int!): Client
      create_product(description: String!, price: Int!): Product
      update_product(id: ID!, description: String!, price: Int!): Product
    }
  `;

  return merged;
  
}

export default mergeTypes;