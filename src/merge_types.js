const mergeTypes = (types, options) => {

  const schema = `
    schema {
      query: Query,
      mutation: Mutation
    }

    type Query {
      ${types.map(({ queries }) => queries).join('')}
    }

    type Mutation {
      ${types.map(({ mutations }) => mutations).join('')}
    }
  `;

  return [schema, ...types.map(({ type }) => type)];
  
}

export default mergeTypes;
