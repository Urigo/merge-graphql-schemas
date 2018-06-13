export default `
  type Client {
    id: ID!
    name: String
    age: Int
  }
  type Query {
    client: Client
  }
  type Query {
    client: Client @test
  }
`;
