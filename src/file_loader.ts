import { loadFiles } from '@graphql-toolkit/file-loading';

const DEFAULT_EXTENSIONS = ['ts', 'js', 'gql', 'graphql', 'graphqls'];
const DEFAULT_IGNORED_EXTENSIONS = ['spec', 'test', 'd', 'map'];

export const fileLoader = <T = any>(
  path: string,
  { 
    recursive = false, 
    extensions = DEFAULT_EXTENSIONS, 
    globOptions = {},
    ignoreIndex = true, 
    ignoredExtensions = DEFAULT_IGNORED_EXTENSIONS,
  } = {},
): T[] => {
  return loadFiles(path, {
      globOptions,
      extensions: extensions.map(e => e.startsWith('.') ? e.substr(1, e.length - 1) : e).filter(e => DEFAULT_EXTENSIONS.includes(e)),
      recursive,
      ignoreIndex,
      ignoredExtensions,
    })
};

