import merge from 'deepmerge';

const mergeResolvers = resolvers => merge.all(resolvers);

export default mergeResolvers;
