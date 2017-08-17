export default `
  type Vendor implements PersonEntity {
    id: ID!
    name: String
    age: Int
    dob: Date
  }

  type Query {
    vendors: [Vendor]
  }
`;
