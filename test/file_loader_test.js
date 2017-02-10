import chai from 'chai';
import fileLoader from '../src/file_loader';
import * as clientType from './graphql/types/client_type';
import * as productType from './graphql/types/product_type';

const assert = chai.assert;

describe('fileLoader', () => {
  describe('with default options', () => {

    it('loads all files from specified folder', async () => {

      const types = [clientType, productType];
      const loadedTypes = fileLoader('../test/graphql/types');

      assert.deepEqual(loadedTypes, types);
     
    });
  });
});