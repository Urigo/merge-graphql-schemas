// ./graphql/types/index.js
import { mergeTypes } from 'merge-graphql-schemas';
import clientType from './clientType';
import productType from './productType';

const types = [
  clientType,
  productType,
];

// NOTE: 2nd param is optional, and defaults to false
// Only use if you have defined the same type multiple times in
// different files and wish to attempt merging them together.
export default mergeTypes(types, { all: true });
