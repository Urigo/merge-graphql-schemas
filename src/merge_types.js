import { mergeTypeDefs } from 'graphql-toolkit';

const mergeTypes = (types, options) => {
  const schemaDefinition = options && typeof options.schemaDefinition === 'boolean'
    ? options.schemaDefinition
    : true;

  return mergeTypeDefs(types, {
    useSchemaDefinition: schemaDefinition,
    forceSchemaDefinition: schemaDefinition,
    throwOnConflict: true,
    commentDescriptions: true,
    reverseDirectives: true,
  });
};

export default mergeTypes;
