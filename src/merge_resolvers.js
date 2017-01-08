const mergeResolvers = (resolvers, options) => {

  const queryResolvers = Object.assign(
    {},
    ...resolvers.map(({ queries }) => queries)
  );

  const mutationResolvers = {};

  const subQueriesResolvers = {};

  return Object.assign(
    {
      Query: queryResolvers,
      Mutation: mutationResolvers,
    },
    subQueriesResolvers
  ); 
  
}

export default mergeResolvers;
