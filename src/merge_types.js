import { mergeTypeDefs } from 'graphql-toolkit';

const mergeTypes = types => mergeTypeDefs(types, {
  useSchemaDefinition: true,
  forceSchemaDefinition: true,
  throwOnConflict: true,
  commentDescriptions: true,
  reverseDirectives: true,
});

export default mergeTypes;
