import fs from 'fs';
import path from 'path';
import fileLoader from '../src/file_loader';
import clientType from './graphql/types/client_type';
import productType from './graphql/types/client/product_type';
import vendorType from './graphql/types/vendor_type';
import personEntityType from './graphql/types/person_entity_type';
import personSearchType from './graphql/types/person_search_type';
import clientResolver from './graphql/resolvers/client_resolver';
import productResolver from './graphql/resolvers/product_resolver';
import vendorResolver from './graphql/resolvers/vendor_resolver';

const rawType = fs.readFileSync(`${__dirname}/graphql/types/raw_type.graphqls`).toString();
const raw2Type = fs.readFileSync(`${__dirname}/graphql/types/client/raw2_type.gql`).toString();

describe('fileLoader', () => {
  it('loads all files from specified folder', () => {
    const types = [
      clientType, personEntityType, personSearchType, rawType, vendorType,
    ];

    const loadedTypes = fileLoader(path.join(__dirname, 'graphql/types'));

    expect(loadedTypes).toEqual(types);
  });

  it('ignores index files', () => {
    const resolvers = [clientResolver, productResolver, vendorResolver];
    const loadedResolvers = fileLoader(path.join(__dirname, 'graphql/resolvers'));

    expect(loadedResolvers).toEqual(resolvers);
  });

  it('loads all files recursively from specified folder', () => {

    const types = [
      productType, raw2Type, clientType, personEntityType, personSearchType, rawType, vendorType,
    ];

    const loadedTypes = fileLoader(path.join(__dirname, 'graphql/types'), { recursive: true });

    expect(loadedTypes).toEqual(types);
  });
});
