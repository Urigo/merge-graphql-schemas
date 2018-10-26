// NOTE: Currently using a slightly modified print instead of the exported graphql version.
import { parse /* ,print */ } from 'graphql';
import { getDescription } from 'graphql/utilities/buildASTSchema';

// TODO: Refactor code and switch to using print from graphql directly.
import print from './utilities/astPrinter';
import { makeSchema, mergeableTypes } from './utilities/makeSchema';
import { isObjectTypeDefinition, isObjectSchemaDefinition, isEnumTypeDefinition } from './utilities/astHelpers';

const _isMergeableTypeDefinition = (def, all) =>
  isObjectTypeDefinition(def) && (mergeableTypes.includes(def.name.value) || all);

const _isNonMergeableTypeDefinition = (def, all) => !_isMergeableTypeDefinition(def, all);

const _makeCommentNode = value => ({ kind: 'Comment', value });

const _addCommentsToAST = (nodes = [], flatten = true) => {
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
      if (isObjectTypeDefinition(def) || isEnumTypeDefinition(def)) {
        return {
          ...def,
          fields: def.fields ? _addCommentsToAST(def.fields) : undefined,
          values: def.values ? _addCommentsToAST(def.values) : undefined,
        };
      }

      return def;
    });

// Gracefully handle nested pathing of GraphQL types
// skips any attributes that can't be found in path (i.e. type.type.type.value => type.type.value)
// returns chained-property value path of tracker attribute later used for comparison
// (i.e. 'ListType.NamedType.SomeValue' !== 'NonNullType.ListType.NamedType.SomeValue')
const _getGraphQLPath = (path, theObj, tracker) => {
  let result;
  path
    .split('.')
    .reduce((o, x) => {
      if (o && o[x]) {
        const v = o[x].hasOwnProperty.call(tracker) ?
          o[x][tracker] : o[x];
        if (!result) result = v;
        else result += `.${v}`;
        return o[x];
      }
      return o;
    }, theObj);
  return result;
};

const _makeMergedFieldDefinitions = (merged, candidate) => _addCommentsToAST(candidate.fields)
  .reduce((fields, field) => {
    const original = merged.fields.find(base => base.name && typeof base.name.value !== 'undefined' &&
      field.name && typeof field.name.value !== 'undefined' &&
      base.name.value === field.name.value);
    if (!original) {
      fields.push(field);
    } else if (field.type.kind === 'NamedType') {
      const fieldName = (field.type.name && field.type.name.value) || null;
      const originalName = (original.type.name && original.type.name.value) || null;
      if (!fieldName || !originalName || (fieldName !== originalName)) {
        throw new Error(`Conflicting types for ${merged.name.value}.${fieldName}: ${fieldName || 'undefined'} != ${originalName}`);
      }
    } else if (field.type.kind === 'NonNullType' || field.type.kind === 'ListType') {
      const path = _getGraphQLPath('type.type.type.value', field, 'kind');
      const originalPath = _getGraphQLPath('type.type.type.value', original, 'kind');

      if (path !== originalPath) {
        throw new Error(
          `Conflicting types for ${merged.name.value}.${field.name.value}: ` +
          `${path} != ${originalPath}`,
        );
      }
    }

    // retain directives of both fields.
    if (original) {
      original.directives = original.directives.concat(field.directives);
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
              fields: def.fields ? _addCommentsToAST(def.fields) : undefined,
              values: def.values ? _addCommentsToAST(def.values) : undefined,
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
