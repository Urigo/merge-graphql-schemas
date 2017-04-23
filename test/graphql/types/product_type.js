export default `
  type Product {
    id: ID!
    description: String
    price: Int
    clients: [Client]
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
  }

  type Mutation {
    create_product(description: String!, price: Int!): Product
    update_product(id: ID!, description: String!, price: Int!): Product
  }

  enum ProductTypes {
    NEW
    USED
    REFURBISHED
  }

  enum ProductPriceType {
    REGULAR
    PROMOTION
    SALE
  }
`;
