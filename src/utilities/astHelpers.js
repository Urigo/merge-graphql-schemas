import { Kind } from 'graphql';

const hasDefinitionWithName = (nodes, name) =>
  nodes.findIndex(node => node.name.value === name) !== -1;

const isObjectTypeDefinition = def => def.kind === Kind.OBJECT_TYPE_DEFINITION;

const isObjectSchemaDefinition = def => def.kind === Kind.SCHEMA_DEFINITION;

export { hasDefinitionWithName, isObjectTypeDefinition, isObjectSchemaDefinition };
