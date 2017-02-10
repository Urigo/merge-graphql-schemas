const mergeResolvers = (resolvers, options) => {

  const queryResolvers = Object.assign(
    {},
    ...resolvers.map(({ queries }) => queries)
  );

  const mutationResolvers = Object.assign(
    {},
    ...resolvers.map(({ mutations }) => mutations)
  );

  const subQueriesResolvers = Object.assign(
    {},
    ...resolvers.map(({ subQueries }) => subQueries)
  );

  return Object.assign(
    {
      Query: queryResolvers,
      Mutation: mutationResolvers,
    },
    subQueriesResolvers
  ); 
  
}

export default mergeResolvers;
