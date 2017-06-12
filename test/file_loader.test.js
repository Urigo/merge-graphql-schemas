import fs from 'fs';
import path from 'path';
import fileLoader from '../src/file_loader';
import clientType from './graphql/types/client_type';
import productType from './graphql/types/product_type';
import vendorType from './graphql/types/vendor_type';
import personEntityType from './graphql/types/person_entity_type';
import personSearchType from './graphql/types/person_search_type';

describe('fileLoader', () => {
  describe('with default options', () => {
    it('loads all files from specified folder', () => {
      const rawType = fs.readFileSync(`${__dirname}/graphql/types/raw_type.graphqls`).toString();

      const types = [
        clientType, personEntityType, personSearchType, productType, rawType, vendorType,
      ];

      const loadedTypes = fileLoader(path.join(__dirname, 'graphql/types'));

      expect(loadedTypes).toEqual(types);
    });
  });
});
