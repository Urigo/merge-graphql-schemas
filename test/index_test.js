import assert from 'assert';
import td from 'testdouble';
import path from 'path';


const graphqlToolsMock = td.object(['makeExecutableSchema']);
const mergeTypes = () => 'mergedTypes';
const mergeResolvers = () => 'mergedResolvers';
let mergeGraphqlSchemas;

describe('mergeGraphqlSchemas', () => {

  before(() => {
    td.replace('graphql-tools', graphqlToolsMock);
    td.replace('../src/merge_types', mergeTypes);
    td.replace('../src/merge_resolvers', mergeResolvers);
    mergeGraphqlSchemas = require('../src/index').mergeGraphqlSchemas;
  });

  afterEach(() => {
    td.reset();
  });

  describe('passing graphql folder', () => {

    it('should pass', async () => {
      mergeGraphqlSchemas(path.join(__dirname, '/graphql'));

      td.verify(graphqlToolsMock.makeExecutableSchema({
        typeDefs: 'mergedTypes',
        resolvers: 'mergedResolvers',
      }));
    });

  });

});
