import merge from 'deepmerge';

const mergeResolvers = resolvers => merge(...resolvers);

export default mergeResolvers;
