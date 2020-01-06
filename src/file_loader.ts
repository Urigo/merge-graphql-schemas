import { loadFiles, LoadFilesOptions } from '@graphql-toolkit/file-loading';

const DEFAULT_EXTENSIONS = ['ts', 'js', 'gql', 'graphql', 'graphqls'];
const DEFAULT_IGNORED_EXTENSIONS = ['spec', 'test', 'd', 'map'];

export const fileLoader = <T = any>(
  path: string,
  { 
    recursive = false, 
    extensions = DEFAULT_EXTENSIONS, 
    ignoreIndex = true, 
    ignoredExtensions = DEFAULT_IGNORED_EXTENSIONS,
    ...options
  } = {} as LoadFilesOptions,
): T[] => {
  return loadFiles(path, {
      extensions: extensions.map(e => e.startsWith('.') ? e.substr(1, e.length - 1) : e).filter(e => DEFAULT_EXTENSIONS.includes(e)),
      recursive,
      ignoreIndex,
      ignoredExtensions,
      ...options,
    })
};

