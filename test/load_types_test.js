import chai from 'chai';
import loadTypes from '../src/load_types';
import * as clientType from './graphql/types/client_type';
import * as productType from './graphql/types/product_type';

const assert = chai.assert;

describe('loadTypes', () => {
  describe('with default options', () => {

    it('loads all types', async () => {

      const options = {
        typesFolder: '../test/graphql/types',
      }

      const types = [clientType, productType];
      const loadedTypes = loadTypes(options);

      assert.deepEqual(loadedTypes, types);
     
    });
  });
});