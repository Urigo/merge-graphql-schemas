import { Kind } from 'graphql';
import { hasDefinitionWithName } from './astHelpers';

const _mergeableOperationTypes = [
  'query',
  'mutation',
  'subscription',
];

const _makeOperationType = (operation, value) => (
  {
    kind: Kind.OPERATION_TYPE_DEFINITION,
    operation,
    type: {
      kind: Kind.NAMED_TYPE,
      name: {
        kind: Kind.NAME,
        value,
      },
    },
  }
);

const mergeableTypes = [
  'Query',
  'Mutation',
  'Subscription',
];

const makeSchema = (definitions) => {
  const operationTypes = mergeableTypes
    .slice(1)
    .map(
      (type, key) => {
        if (hasDefinitionWithName(definitions, type)) {
          return _makeOperationType(_mergeableOperationTypes[key + 1], type);
        }

        return null;
      },
    )
    .filter(operationType => operationType);

  operationTypes.unshift(_makeOperationType(_mergeableOperationTypes[0], mergeableTypes[0]));

  return {
    kind: Kind.SCHEMA_DEFINITION,
    directives: [],
    operationTypes,
  };
};

export { mergeableTypes, makeSchema };
