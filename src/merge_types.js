// NOTE: Currently using a slightly modified print instead of the exported graphql version.
import { parse /* ,print */ } from 'graphql';
import { getDescription } from 'graphql/utilities/buildASTSchema';

// TODO: Refactor code and switch to using print from graphql directly.
import print from './utilities/astPrinter';
import { makeSchema, mergeableTypes } from './utilities/makeSchema';
import { isObjectTypeDefinition, isObjectSchemaDefinition } from './utilities/astHelpers';

const _isMergeableTypeDefinition = (def, all) =>
  isObjectTypeDefinition(def) && (mergeableTypes.includes(def.name.value) || all);

const _isNonMergeableTypeDefinition = (def, all) => !_isMergeableTypeDefinition(def, all);

const _makeCommentNode = value => ({ kind: 'Comment', value });

const _addCommentsToAST = (nodes, flatten = true) => {
  const astWithComments = nodes.map(
    (node) => {
      const description = getDescription(node, { commentDescriptions: true });
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

const _makeRestDefinitions = (defs, all = false) =>
  defs
    .filter(def => _isNonMergeableTypeDefinition(def, all) && !isObjectSchemaDefinition(def))
    .map((def) => {
      if (isObjectTypeDefinition(def)) {
        return {
          ...def,
          fields: _addCommentsToAST(def.fields),
        };
      }

      return def;
    });

const _makeMergedFieldDefinitions = (merged, candidate) => _addCommentsToAST(candidate.fields)
  .reduce((fields, field) => {
    const original = merged.fields.find(base => base.name && typeof base.name.value !== 'undefined' &&
      field.name && typeof field.name.value !== 'undefined' &&
      base.name.value === field.name.value);
    if (!original) {
      fields.push(field);
    } else if (field.type.name.value !== original.type.name.value) {
      throw new Error(
        `Conflicting types for ${merged.name.value}.${field.name.value}: ` +
        `${field.type.name.value} != ${original.type.name.value}`,
      );
    }
    return fields;
  }, merged.fields);

const _makeMergedDefinitions = (defs, all = false) => {
  // TODO: This function can be cleaner!
  const groupedMergableDefinitions = defs
    .filter(def => _isMergeableTypeDefinition(def, all))
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
            fields: _makeMergedFieldDefinitions(mergableDefs[name], def),
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

const mergeTypes = (types, options = { all: false }) => {
  const allDefs = types
    .map((type) => {
      if (typeof type === 'string') {
        return parse(type);
      }
      return type;
    })
    .map(ast => ast.definitions)
    .reduce((defs, newDef) => [...defs, ...newDef], []);

  const mergedDefs = _makeMergedDefinitions(allDefs, options.all);
  const rest = _addCommentsToAST(_makeRestDefinitions(allDefs, options.all), false)
    .map(printDefinitions);
  const schemaDefs = allDefs.filter(isObjectSchemaDefinition);
  const schema = printDefinitions([makeSchema(mergedDefs, schemaDefs), ...mergedDefs]);

  return [schema, ...rest].join('\n');
};

export default mergeTypes;
