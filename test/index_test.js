import assert from 'assert';
import td from 'testdouble';

const graphqlToolsMock = td.object(['makeExecutableSchema']);
let mergeGraphqlSchemas;

describe('mergeGraphqlSchema', () => {

  before(() => {
    td.replace('graphql-tools', graphqlToolsMock);
    mergeGraphqlSchemas = require('../src/index').default;
    console.log(mergeGraphqlSchemas)
  });

  afterEach(() => {
    td.reset();
  });

  describe('without arguments', () => {

    it('should pass', async () => {
      mergeGraphqlSchemas();

      td.verify(graphqlToolsMock.makeExecutableSchema([], []));
    });

  });

  describe('passing graphql folder', () => {

    it('should pass', async () => {
      mergeGraphqlSchemas('../test/graphql');

      td.verify(graphqlToolsMock.makeExecutableSchema([], []));
    });

  });
  
  describe('passing options object', () => {

    it('should pass', async () => {
      mergeGraphqlSchemas({});

      td.verify(graphqlToolsMock.makeExecutableSchema([], []));
    });

  });
});
