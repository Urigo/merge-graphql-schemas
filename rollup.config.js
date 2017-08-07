import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';

import pkg from './package.json';

export default [
  {
    entry: 'src/index.js',
    external: [
      'fs',
      'path',
      'deepmerge',
      'graphql',
      'graphql/language/visitor',
      'graphql/utilities/buildASTSchema',
    ],
    plugins: [
      resolve(), // so Rollup can find any commonjs packages
      babel({
        exclude: 'node_modules/**', // only transpile our source code
      }),
      commonjs(), // so Rollup can convert commonjs to an ES module
      filesize(),
    ],
    targets: [
      { dest: pkg.main, format: 'cjs' },
      { dest: pkg.module, format: 'es' },
    ],
  },
];
