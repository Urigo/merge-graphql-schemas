const type = `
  type Product {
    id: ID!
    description: String
    price: Int
  }
`;

const queries = `
  products: [Product]
  product(id: ID!): Product
`;

const mutations = `
  create_product(description: String!, price: Int!): Product
  update_product(id: ID!, description: String!, price: Int!): Product
`;

export { type, queries };
