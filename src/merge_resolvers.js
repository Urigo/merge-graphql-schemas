import merge from 'deepmerge';

const mergeResolvers = resolvers => (resolvers.length === 1 ? resolvers[0] : merge.all(resolvers));

export default mergeResolvers;
