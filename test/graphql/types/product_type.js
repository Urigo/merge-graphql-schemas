export default `
  type Product {
    id: ID!
    description: String
    price: Int
    tag: TAG
    clients: [Client]
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
  }

  type Mutation {
    # Creates a new product with it's description & price
    create_product(description: String!, price: Int!): Product
    update_product(id: ID!, description: String!, price: Int!): Product
  }

  type Subscription {
    activeProducts: [Product]
  }

  enum ProductTypes {
    NEW
    USED
    REFURBISHED
  }

  scalar TAG

  enum ProductPriceType {
    REGULAR
    PROMOTION
    SALE
  }
`;
