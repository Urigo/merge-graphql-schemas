import fs from 'fs';
import path from 'path';
import fileLoader from '../src/file_loader';
import clientType from './graphql/types/client_type';
import productType from './graphql/types/product_type';
import vendorType from './graphql/types/vendor_type';
import personEntityType from './graphql/types/person_entity_type';
import personSearchType from './graphql/types/person_search_type';
import clientResolver from './graphql/resolvers/client_resolver';
import productResolver from './graphql/resolvers/product_resolver';
import vendorResolver from './graphql/resolvers/vendor_resolver';

describe('fileLoader', () => {
  it('loads all files from specified folder', () => {
    const rawType = fs.readFileSync(`${__dirname}/graphql/types/raw_type.graphqls`).toString();

    const types = [
      clientType, personEntityType, personSearchType, productType, rawType, vendorType,
    ];

    const loadedTypes = fileLoader(path.join(__dirname, 'graphql/types'));

    expect(loadedTypes).toEqual(types);
  });

  it('ignores index files', () => {
    const resolvers = [clientResolver, productResolver, vendorResolver];
    const loadedResolvers = fileLoader(path.join(__dirname, 'graphql/resolvers'));

    expect(loadedResolvers).toEqual(resolvers);
  });
});
