import { makeExecutableSchema } from 'graphql-tools';
import fileLoader from './file_loader';
import mergeTypes from './merge_types';
import mergeResolvers from './merge_resolvers';

const mergeGraphqlSchema = (options) => {
  let typesFolder;
  let resolversFolder;

  if (options === undefined) {
    typesFolder = './graphql/types';
    resolversFolder = './graphql/resolvers';
  } else if (typeof options === 'string') {
    typesFolder = `${options}/types`;
    resolversFolder = `${options}/resolvers`;
  } else if (typeof options === 'object') {
    typesFolder = options.typesFolder || './graphql/types';
    resolversFolder = options.resolversFolder || './graphql/resolvers';
  }

  const typeFiles = fileLoader(typesFolder);
  const mergedTypes = mergeTypes(typeFiles);

  const resolverFiles = fileLoader(resolversFolder);
  const mergedResolvers = mergeResolvers(resolverFiles);

  return makeExecutableSchema(mergedTypes, mergedResolvers);
};

export default mergeGraphqlSchema;
