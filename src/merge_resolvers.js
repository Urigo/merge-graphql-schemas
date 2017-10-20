import merge from 'deepmerge';

const mergeResolvers = (resolvers) => {
  if (resolvers.length === 1) {
    return resolvers[0];
  }
  return merge.all(resolvers);
};

export default mergeResolvers;
