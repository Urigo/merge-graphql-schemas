export default `
  type Client {
    id: ID!
    name: String
    age: Int
  }
  type Query {
    client: Client @foo @foo
  }
  type Query {
    client: Client @bar
  }
  type Query {
    client: Client @foo @bar
  }
`;
