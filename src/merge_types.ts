import { mergeTypeDefs } from '@graphql-toolkit/schema-merging';

type Config = Parameters<typeof mergeTypeDefs>[1];

export const mergeTypes = (types: any[], options?: { schemaDefinition?: boolean, all?: boolean } & Partial<Config>) => {
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

