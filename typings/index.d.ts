import { DocumentNode, Source } from 'graphql';
import { Dirent } from 'fs';

export function mergeTypes(
  types: Array<string | Source | DocumentNode>,
  options?: { all: boolean }
): string;

export function mergeResolvers<T>(args: T[]): T;

export function fileLoader(
  path: string,
  options?: {
    recursive?: boolean;
    extensions?: string[];
    globOptions?: object;
  }
): Array<string | Buffer | Dirent>;
