import { makeExecutableSchema } from 'graphql-tools';
import fileLoader from './file_loader';
import mergeTypes from './merge_types';
import mergeResolvers from './merge_resolvers';

const mergeGraphqlSchemas = (folderPath, debug = false) => {
  const typesArray = fileLoader(`${folderPath}/types`);
  const resolversArray = fileLoader(`${folderPath}/resolvers`);


  const typeDefs = mergeTypes(typesArray);
  const resolvers = mergeResolvers(resolversArray);

  if (debug === true) {
    console.log('===> SCHEMA: ', typeDefs); // eslint-disable-line
    console.log('===> RESOLVERS: ', resolvers); // eslint-disable-line
  }

  return makeExecutableSchema({ typeDefs, resolvers });
};

export { mergeGraphqlSchemas, mergeResolvers, mergeTypes };
