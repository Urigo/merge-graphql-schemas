import assert from 'assert';
import td from 'testdouble';

const graphqlToolsMock = td.object(['makeExecutableSchema']);
const mergeTypes = () => 'mergedTypes';
const mergeResolvers = () => 'mergedResolvers';
let mergeGraphqlSchemas;

describe('mergeGraphqlSchema', () => {

  before(() => {
    td.replace('graphql-tools', graphqlToolsMock);
    td.replace('../src/merge_types', mergeTypes);
    td.replace('../src/merge_resolvers', mergeResolvers);
    mergeGraphqlSchemas = require('../src/index').default;
    console.log(mergeGraphqlSchemas)
  });

  afterEach(() => {
    td.reset();
  });

  // describe('without arguments', () => {

  //   it('should pass', async () => {
  //     mergeGraphqlSchemas();

  //     td.verify(graphqlToolsMock.makeExecutableSchema('mergedTypes', 'mergedResolvers'));
  //   });

  // });

  describe('passing graphql folder', () => {

    it('should pass', async () => {
      mergeGraphqlSchemas('../test/graphql');

      td.verify(graphqlToolsMock.makeExecutableSchema('mergedTypes', 'mergedResolvers'));
    });

  });

  describe('passing options object', () => {

    it('should pass', async () => {
      const options = {
        typesFolder: '../test/graphql/types',
        resolversFolder: '../test/graphql/resolvers'
      };

      mergeGraphqlSchemas(options);

      td.verify(graphqlToolsMock.makeExecutableSchema('mergedTypes', 'mergedResolvers'));
    });

  });
});
