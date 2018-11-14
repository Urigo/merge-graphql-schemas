/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * NOTE: ==> This file has been modified just to add comments to the printed AST
 * This is a temp measure, we will move to using the original non modified printer.js ASAP.
 */

import { visit } from 'graphql/language/visitor';

/**
 * Given maybeArray, print an empty string if it is null or empty, otherwise
 * print all items together separated by separator if provided
 */
function join(maybeArray, separator) {
  return maybeArray ? maybeArray.filter(x => x).join(separator || '') : '';
}

function addDescription(cb) {
  return node => join([node.description, cb(node)], '\n');
}

function indent(maybeString) {
  return maybeString && `  ${maybeString.replace(/\n/g, '\n  ')}`;
}

/**
 * Given array, print each item on its own line, wrapped in an
 * indented "{ }" block.
 */
function block(array) {
  return array && array.length !== 0 ? `{\n${indent(join(array, '\n'))}\n}` : '';
}

/**
 * If maybeString is not null or empty, then wrap with start and end, otherwise
 * print an empty string.
 */
function wrap(start, maybeString, end) {
  return maybeString ? start + maybeString + (end || '') : '';
}

/**
 * Print a block string in the indented block form by adding a leading and
 * trailing blank line. However, if a block string starts with whitespace and is
 * a single-line, adding a leading blank line would strip that whitespace.
 */
function printBlockString(value, isDescription) {
  const escaped = value.replace(/"""/g, '\\"""');
  return (value[0] === ' ' || value[0] === '\t') && value.indexOf('\n') === -1
    ? `"""${escaped.replace(/"$/, '"\n')}"""`
    : `"""\n${isDescription ? escaped : indent(escaped)}\n"""`;
}

const printDocASTReducer = {
  Name: node => node.value,
  Variable: node => `$${node.name}`,

  // Document

  Document: node => `${node.definitions
    .map(defNode => `${defNode}\n${defNode[0] === '#' ? '' : '\n'}`)
    .join('')
    .trim()}\n`,

  OperationDefinition(node) {
    const op = node.operation;
    const { name, selectionSet } = node;
    const varDefs = wrap('(', join(node.variableDefinitions, ', '), ')');
    const directives = join(node.directives, ' ');
    // Anonymous queries with no directives or variable definitions can use
    // the query short form.
    return !name && !directives && !varDefs && op === 'query'
      ? selectionSet
      : join([op, join([name, varDefs]), directives, selectionSet], ' ');
  },

  VariableDefinition: ({ variable, type, defaultValue }) => `${variable}: ${type}${wrap(' = ', defaultValue)}`,

  SelectionSet: ({ selections }) => block(selections),

  Field: ({
    alias, name, arguments: args, directives, selectionSet,
  }) => join(
    [
      wrap('', alias, ': ') + name + wrap('(', join(args, ', '), ')'),
      join(directives, ' '),
      selectionSet,
    ],
    '  ',
  ),

  Argument: ({ name, value }) => `${name}: ${value}`,

  // Fragments

  FragmentSpread: ({ name, directives }) => `...${name}${wrap(' ', join(directives, ' '))}`,

  InlineFragment: ({ typeCondition, directives, selectionSet }) => join(['...', wrap('on ', typeCondition), join(directives, ' '), selectionSet], ' '),

  FragmentDefinition: ({
    name, typeCondition, variableDefinitions, directives, selectionSet,
  }) => `${`fragment ${name}${wrap('(', join(variableDefinitions, ', '), ')')} `
      + `on ${typeCondition} ${wrap('', join(directives, ' '), ' ')}`}${selectionSet}`,

  // Value

  IntValue: ({ value }) => value,
  FloatValue: ({ value }) => value,
  StringValue: ({ value, block: isBlockString }, key) => (isBlockString ? printBlockString(value, key === 'description') : JSON.stringify(value)),
  BooleanValue: ({ value }) => (value ? 'true' : 'false'),
  NullValue: () => 'null',
  EnumValue: ({ value }) => value,
  ListValue: ({ values }) => `[${join(values, ', ')}]`,
  ObjectValue: ({ fields }) => `{${join(fields, ', ')}}`,
  ObjectField: ({ name, value }) => `${name}: ${value}`,

  // Directive

  Directive: ({ name, arguments: args }) => `@${name}${wrap('(', join(args, ', '), ')')}`,

  // Type

  NamedType: ({ name }) => name,
  ListType: ({ type }) => `[${type}]`,
  NonNullType: ({ type }) => `${type}!`,

  // Type System Definitions

  SchemaDefinition: ({ directives, operationTypes }) => join(['schema', join(directives, ' '), block(operationTypes)], ' '),

  OperationTypeDefinition: ({ operation, type }) => `${operation}: ${type}`,

  ScalarTypeDefinition: addDescription(({ name, directives }) => join(['scalar', name, join(directives, ' ')], ' ')),

  ObjectTypeDefinition: addDescription(({
    name, interfaces, directives, fields,
  }) => join(
    [
      'type',
      name,
      wrap('implements ', join(interfaces, ' & ')),
      join(directives, ' '),
      block(fields),
    ],
    ' ',
  )),

  FieldDefinition: addDescription(
    ({
      name, arguments: args, type, directives,
    }) => `${name + wrap('(', join(args, ', '), ')')}: ${type}${wrap(' ', join(directives, ' '))}`,
  ),

  InputValueDefinition: addDescription(({
    name, type, defaultValue, directives,
  }) => join([`${name}: ${type}`, wrap('= ', defaultValue), join(directives, ' ')], ' ')),

  InterfaceTypeDefinition: addDescription(({ name, directives, fields }) => join(['interface', name, join(directives, ' '), block(fields)], ' ')),

  UnionTypeDefinition: addDescription(({ name, directives, types }) => join(
    [
      'union',
      name,
      join(directives, ' '),
      types && types.length !== 0 ? `= ${join(types, ' | ')}` : '',
    ],
    ' ',
  )),

  EnumTypeDefinition: addDescription(({ name, directives, values }) => join(['enum', name, join(directives, ' '), block(values)], ' ')),

  EnumValueDefinition: addDescription(({ name, directives }) => join([name, join(directives, ' ')], ' ')),

  InputObjectTypeDefinition: addDescription(({ name, directives, fields }) => join(['input', name, join(directives, ' '), block(fields)], ' ')),

  ScalarTypeExtension: ({ name, directives }) => join(['extend scalar', name, join(directives, ' ')], ' '),

  ObjectTypeExtension: ({
    name, interfaces, directives, fields,
  }) => join(
    [
      'extend type',
      name,
      wrap('implements ', join(interfaces, ' & ')),
      join(directives, ' '),
      block(fields),
    ],
    ' ',
  ),

  InterfaceTypeExtension: ({ name, directives, fields }) => join(['extend interface', name, join(directives, ' '), block(fields)], ' '),

  UnionTypeExtension: ({ name, directives, types }) => join(
    [
      'extend union',
      name,
      join(directives, ' '),
      types && types.length !== 0 ? `= ${join(types, ' | ')}` : '',
    ],
    ' ',
  ),

  EnumTypeExtension: ({ name, directives, values }) => join(['extend enum', name, join(directives, ' '), block(values)], ' '),

  InputObjectTypeExtension: ({ name, directives, fields }) => join(['extend input', name, join(directives, ' '), block(fields)], ' '),

  DirectiveDefinition: addDescription(
    ({ name, arguments: args, locations }) => `directive @${name}${wrap('(', join(args, ', '), ')')} on ${join(locations, ' | ')}`,
  ),

  Comment: ({ value }) => `# ${value.replace(/\n/g, '\n # ')}`,
};

/**
 * Converts an AST into a string, using one set of reasonable
 * formatting rules.
 */
export default function print(ast) {
  return visit(ast, { leave: printDocASTReducer });
}
