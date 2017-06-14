import { Kind } from 'graphql';

export function hasDefinitionWithName(nodes, name) {
  return nodes.findIndex(node => node.name.value === name) !== -1;
}

export function isObjectTypeDefinition(def) {
  return def.kind === Kind.OBJECT_TYPE_DEFINITION;
}
