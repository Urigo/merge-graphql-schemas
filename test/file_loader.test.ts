import fs from 'fs';
import path from 'path';
import fileLoader from '../src/file_loader';
import clientType from './graphql/types/client_type';
import contactType from './graphql/types/client/contact_type';
import productType from './graphql/types/product_type';
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
      clientType,
      personEntityType,
      personSearchType,
      productType,
      rawType,
      vendorType,
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
      contactType,
      raw2Type,
      clientType,
      personEntityType,
      personSearchType,
      productType,
      rawType,
      vendorType,
    ];

    const loadedTypes = fileLoader(path.join(__dirname, 'graphql/types'), { recursive: true });

    expect(loadedTypes).toEqual(types);
  });

  it('loads all files from specified folder with ext .js', () => {
    const types = [clientType, personEntityType, personSearchType, productType, vendorType];

    const loadedTypes = fileLoader(path.join(__dirname, 'graphql/types'), { extensions: ['.js'] });

    expect(loadedTypes).toEqual(types);
  });

  it('loads all files from specified folder with ext .graphqls', () => {
    const types = [rawType];

    const loadedTypes = fileLoader(path.join(__dirname, 'graphql/types'), {
      extensions: ['.graphqls'],
    });

    expect(loadedTypes).toEqual(types);
  });

  it('unexpected extension should be ignored', () => {
    const types = [rawType];

    const loadedTypes = fileLoader(path.join(__dirname, 'graphql/types'), {
      extensions: ['.graphqls', '.txt'],
    });

    expect(loadedTypes).toEqual(types);
  });

  it('loads all files from glob pattern of ext .graphqls or .gql', () => {
    const types = [raw2Type, rawType];

    const loadedTypes = fileLoader(path.join(__dirname, 'graphql/**/*.+(graphqls|gql)'));

    expect(loadedTypes).toEqual(types);
  });
});
