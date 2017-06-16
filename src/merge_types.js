import { parse } from 'graphql';
import { getDescription } from 'graphql/utilities/buildASTSchema';
import print from './utilities/astPrinter';
import { isObjectTypeDefinition } from './utilities/astHelpers';
import makeSchema, { mergableTypes } from './utilities/makeSchema';
import validateSchema from './validate_schema';

function isMergableTypeDefinition(def) {
  return isObjectTypeDefinition(def) && mergableTypes.includes(def.name.value);
}

function isNonMergableTypeDefinition(def) {
  return !isMergableTypeDefinition(def);
}

function makeCommentNode(value) {
  return {
    kind: 'Comment',
    value,
  };
}

function addCommentsToAST(nodes, flatten = true) {
  const astWithComments = nodes.map(
    (node) => {
      const description = getDescription(node);

      if (description) {
        return [makeCommentNode(description), node];
      }

      return [node];
    },
  );

  if (flatten) {
    return astWithComments.reduce((a, b) => a.concat(b), []);
  }

  return astWithComments;
}

function makeRestDefinitions(defs) {
  return defs
    .filter(isNonMergableTypeDefinition)
    .map((def) => {
      if (isObjectTypeDefinition(def)) {
        return {
          ...def,
          fields: addCommentsToAST(def.fields),
        };
      }

      return def;
    });
}

function makeMergedMergableDefinitions(defs) {
  // TODO: This function can be cleaner!
  const groupedMergableDefinitions = defs
    .filter(isMergableTypeDefinition)
    .reduce(
      (mergableDefs, def) => {
        const name = def.name.value;

        if (!mergableDefs[name]) {
          return {
            ...mergableDefs,
            [name]: {
              ...def,
              fields: addCommentsToAST(def.fields),
            },
          };
        }

        return {
          ...mergableDefs,
          [name]: {
            ...mergableDefs[name],
            fields: [
              ...mergableDefs[name].fields,
              ...addCommentsToAST(def.fields),
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
}

function makeDocumentWithDefinitions(definitions) {
  return {
    kind: 'Document',
    definitions: definitions instanceof Array ? definitions : [definitions],
  };
}

function printDefinitions(defs) {
  return print(makeDocumentWithDefinitions(defs));
}

export default function mergeTypes(types) {
  const allDefs = types
    .map(parse)
    .map(ast => ast.definitions)
    .reduce((defs, newDef) => [...defs, ...newDef], []);

  const mergedDefs = makeMergedMergableDefinitions(allDefs);
  const rest = addCommentsToAST(makeRestDefinitions(allDefs), false).map(printDefinitions);
  const schema = printDefinitions([makeSchema(mergedDefs), ...mergedDefs]);

  validateSchema(schema, rest);
  return [schema, ...rest];
}

