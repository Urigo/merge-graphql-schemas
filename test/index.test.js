import path from 'path';
import * as graphqlTools from 'graphql-tools';
import * as mergedTypes from '../src/merge_types';
import * as mergedResolvers from '../src/merge_resolvers';
import { mergeGraphqlSchemas } from '../src/index';

describe('mergeGraphqlSchemas', () => {
  describe('passing graphql folder', () => {
    it('should call makeExecutableSchema with mergedTypes and mergedResolvers', () => {
      graphqlTools.makeExecutableSchema = jest.fn();
      mergedTypes.default = jest.fn(() => 'mergedTypes');
      mergedResolvers.default = jest.fn(() => 'mergedResolvers');

      mergeGraphqlSchemas(path.join(__dirname, '/graphql'));

      expect(graphqlTools.makeExecutableSchema).toBeCalledWith({
        typeDefs: 'mergedTypes',
        resolvers: 'mergedResolvers',
      });
    });
  });
});
