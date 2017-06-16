import { Kind } from 'graphql';
import { hasDefinitionWithName } from './astHelpers';

export const mergableTypes = [
  'Query',
  'Mutation',
  'Subscription',
];

export const mergableOperationTypes = [
  'query',
  'mutation',
  'subscription',
];

function makeOperationType(operation, value) {
  return {
    kind: Kind.OPERATION_TYPE_DEFINITION,
    operation,
    type: {
      kind: Kind.NAMED_TYPE,
      name: {
        kind: Kind.NAME,
        value,
      },
    },
  };
}

export default function makeSchema(definitions) {
  const operationTypes = mergableTypes
    .slice(1)
    .map(
      (type, key) => {
        if (hasDefinitionWithName(definitions, type)) {
          return makeOperationType(mergableOperationTypes[key + 1], type);
        }

        return null;
      },
    )
    .filter(operationType => operationType);

  operationTypes.unshift(makeOperationType(mergableOperationTypes[0], mergableTypes[0]));

  return {
    kind: Kind.SCHEMA_DEFINITION,
    directives: [],
    operationTypes,
  };
}
