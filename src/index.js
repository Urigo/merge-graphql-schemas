import { makeExecutableSchema } from 'graphql-tools';
import fileLoader from './file_loader';

const mergeGraphqlSchema = (options) => {

  let typesFolder, resolversFolder;

  if (options === undefined) {
    typesFolder = './graphql/types';
    resolversFolder = './graphql/resolvers';
  }
  else if (options instanceof String) {
    typesFolder = `${options}/types`;
    resolversFolder = `${options}/resolvers`;
  } else if ( options instanceof Object) {
    typesFolder = options.typesFolder || './graphql/types';
    resolversFolder = options.resolversFolder || './graphql/resolvers';
  }

  const typeFiles = fileLoader(typesFolder);
  const resolverFiles = fileLoader(resolversFolder);

  return makeExecutableSchema([], []);
  
}

export default mergeGraphqlSchema;