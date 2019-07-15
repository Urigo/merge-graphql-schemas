import { mergeTypeDefs } from 'graphql-toolkit';
import { Config } from 'graphql-toolkit/dist/esnext/epoxy/typedefs-mergers/merge-typedefs';

const mergeTypes = (types: any[], options?: { schemaDefinition?: boolean, all?: boolean } & Partial<Config>) => {
  const schemaDefinition = options && typeof options.schemaDefinition === 'boolean'
    ? options.schemaDefinition
    : true;

  return mergeTypeDefs(types, {
    useSchemaDefinition: schemaDefinition,
    forceSchemaDefinition: schemaDefinition,
    throwOnConflict: true,
    commentDescriptions: true,
    reverseDirectives: true,
    ...options,
  });
};

export default mergeTypes;
