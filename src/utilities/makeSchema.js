import { Kind } from 'graphql';
import { hasDefinitionWithName } from './astHelpers';

const typesMap = {
  query: 'Query',
  mutation: 'Mutation',
  subscription: 'Subscription',
};

const _mergeableOperationTypes = Object.keys(typesMap);

const _makeOperationType = (operation, value) => ({
  kind: Kind.OPERATION_TYPE_DEFINITION,
  operation,
  type: {
    kind: Kind.NAMED_TYPE,
    name: {
      kind: Kind.NAME,
      value,
    },
  },
});

const mergeableTypes = Object.values(typesMap);

const makeSchema = (definitions, schemaDefs) => {
  const operationMap = {
    query: _makeOperationType(_mergeableOperationTypes[0], mergeableTypes[0]),
    mutation: null,
    subscription: null,
  };

  mergeableTypes.slice(1).forEach((type, key) => {
    if (hasDefinitionWithName(definitions, type)) {
      const operation = _mergeableOperationTypes[key + 1];

      operationMap[operation] = _makeOperationType(operation, type);
    }
  });

  const operationTypes = Object.values(operationMap)
    .map((operation, i) => {
      if (!operation) {
        const type = Object.keys(operationMap)[i];

        if (schemaDefs.some(def => def.operationTypes.some(op => op.operation === type))) {
          return _makeOperationType(type, typesMap[type]);
        }
      }

      return operation;
    })
    .filter(op => op);

  return {
    kind: Kind.SCHEMA_DEFINITION,
    directives: [],
    operationTypes,
  };
};

export { mergeableTypes, makeSchema };
