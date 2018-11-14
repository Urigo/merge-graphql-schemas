import { Kind } from 'graphql';

const hasDefinitionWithName = (nodes, name) => nodes.findIndex(node => node.name.value === name) !== -1;

const isObjectTypeDefinition = def => def.kind === Kind.OBJECT_TYPE_DEFINITION
  || def.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION
  || def.kind === Kind.SCALAR_TYPE_DEFINITION
  || def.kind === Kind.ENUM_TYPE_DEFINITION
  || def.kind === Kind.INTERFACE_TYPE_DEFINITION;

const isEnumTypeDefinition = def => def.kind === Kind.ENUM_TYPE_DEFINITION;

const isObjectSchemaDefinition = def => def.kind === Kind.SCHEMA_DEFINITION;

export {
  hasDefinitionWithName,
  isObjectTypeDefinition,
  isObjectSchemaDefinition,
  isEnumTypeDefinition,
};
