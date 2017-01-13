import assert from 'assert';
import mergeGraphqlSchemas from '../index';

describe('test', () => {
  describe('without arguments', () => {

    it('should pass', async () => {
      const schema = mergeGraphqlSchemas()
      assert.equal(schema, 'ok');
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
