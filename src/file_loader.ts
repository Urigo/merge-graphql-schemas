import { loadSchemaFiles } from 'graphql-toolkit';

const DEFAULT_EXTENSIONS = ['ts', 'js', 'gql', 'graphql', 'graphqls'];

const fileLoader = (
  path: string,
  { recursive = false, extensions = DEFAULT_EXTENSIONS, globOptions = {},
    ignoreIndex = true, } = {},
): any[] => {
  return loadSchemaFiles(path, {
      globOptions,
      extensions: extensions.map(e => e.startsWith('.') ? e.substr(1, e.length - 1) : e).filter(e => DEFAULT_EXTENSIONS.includes(e)),
      recursive,
      ignoreIndex,
    })
};

export default fileLoader;
