export default `
  type Client {
    id: ID!
    name: String
    age: Int
  }
  type Query {
    client: Client @foo
  }
  type Query {
    client: Client @bar
  }
`;
