import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';

import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    external: [
      'fs',
      'path',
      'util',
      'events',
      'assert',
      'graphql',
      'graphql/language/visitor',
      'graphql/utilities/buildASTSchema',
      'graphql-toolkit',
    ],
    plugins: [
      resolve(), // so Rollup can find any commonjs packages
      babel({
        exclude: 'node_modules/**', // only transpile our source code
      }),
      commonjs(), // so Rollup can convert commonjs to an ES module
      filesize(),
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
];
