// Test
import { parse } from 'graphql';
import { getDescription } from 'graphql/utilities/buildASTSchema';
import print from './utilities/astPrinter';
import { isObjectTypeDefinition, isObjectSchemaDefinition } from './utilities/astHelpers';
import { makeSchema, mergeableTypes } from './utilities/makeSchema';

const _isMergeableTypeDefinition = def =>
  isObjectTypeDefinition(def) && mergeableTypes.includes(def.name.value);

const _isNonMergeableTypeDefinition = def => !_isMergeableTypeDefinition(def);

const _makeCommentNode = value => ({ kind: 'Comment', value });

const _addCommentsToAST = (nodes, flatten = true) => {
  const astWithComments = nodes.map(
    (node) => {
      const description = getDescription(node);
      if (description) {
        return [_makeCommentNode(description), node];
      }

      return [node];
    },
  );

  if (flatten) {
    return astWithComments.reduce((a, b) => a.concat(b), []);
  }

  return astWithComments;
};

const _makeRestDefinitions = defs =>
  defs
    .filter(def => _isNonMergeableTypeDefinition(def) && !isObjectSchemaDefinition(def))
    .map((def) => {
      if (isObjectTypeDefinition(def)) {
        return {
          ...def,
          fields: _addCommentsToAST(def.fields),
        };
      }

      return def;
    });

const _makeMergedDefinitions = (defs) => {
  // TODO: This function can be cleaner!
  const groupedMergableDefinitions = defs
    .filter(_isMergeableTypeDefinition)
    .reduce(
      (mergableDefs, def) => {
        const name = def.name.value;

        if (!mergableDefs[name]) {
          return {
            ...mergableDefs,
            [name]: {
              ...def,
              fields: _addCommentsToAST(def.fields),
            },
          };
        }

        return {
          ...mergableDefs,
          [name]: {
            ...mergableDefs[name],
            fields: [
              ...mergableDefs[name].fields,
              ..._addCommentsToAST(def.fields),
            ],
          },
        };
      }, {
        Query: null,
        Mutation: null,
        Subscription: null,
      },
    );

  return Object
    .values(groupedMergableDefinitions)
    .reduce((array, def) => (def ? [...array, def] : array), []);
};

const _makeDocumentWithDefinitions = definitions => ({
  kind: 'Document',
  definitions: definitions instanceof Array ? definitions : [definitions],
});

const printDefinitions = defs => print(_makeDocumentWithDefinitions(defs));

const mergeTypes = (types) => {
  const allDefs = types
    .map(parse)
    .map(ast => ast.definitions)
    .reduce((defs, newDef) => [...defs, ...newDef], []);

  const mergedDefs = _makeMergedDefinitions(allDefs);
  const rest = _addCommentsToAST(_makeRestDefinitions(allDefs), false).map(printDefinitions);
  const schemaDefs = allDefs.filter(isObjectSchemaDefinition);
  const schema = printDefinitions([makeSchema(mergedDefs, schemaDefs), ...mergedDefs]);

  return [schema, ...rest].join('\n');
};

export default mergeTypes;
