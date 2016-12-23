import assert from 'assert';
import mergeGraphqlSchemas from '../index';

describe('test', () => {
  it('should pass', async () => {
    const options = mergeGraphqlSchemas('options')
    assert.equal(options, 'options');
  });
});
