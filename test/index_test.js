import assert from 'assert';
import td from 'testdouble';
import mergeGraphqlSchemas from '../index';

const graphqlToolsMock = td.object(['makeExecutableSchema']);
let makeExecutableSchema;

describe('mergeGraphqlSchema', () => {

  before(() => {
    td.replace('graphql-tools', graphqlToolsMock);
    makeExecutableSchema = require('../index').makeExecutableSchema;
  });


  describe('without arguments', () => {

    it('should pass', async () => {
      const schema = mergeGraphqlSchemas()
      // assert.equal(schema, 'ok');
      td.verify(graphqlToolsMock.makeExecutableSchema([], []);
    });

  });

  describe('passing graphql folder', () => {

    it('should pass', async () => {
      const schema = mergeGraphqlSchemas('./tests/graphql')
      assert.equal(schema, 'ok');
    });

  });
  
  describe('passing options object', () => {

    it('should pass', async () => {
      const schema = mergeGraphqlSchemas({ someOption: 'option' })
      assert.equal(schema, 'ok');
    });

  });
});
