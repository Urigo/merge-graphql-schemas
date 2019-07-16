import fs from 'fs';
import path from 'path';
import fileLoader from '../src/file_loader';
import mergeTypes from '../src/merge_types';

const normalizeWhitespace = str => str.replace(/\s+/g, ' ').trim();

describe('when load types based on entity structure', () => {
  it('will selected all scriptc by fileLoader', () => {
    const typesPath = path.join(__dirname, 'graphql/type_with_other_scripts')
    const loadedTypesWithOtherLogic = fileLoader(typesPath, { recursive: true });
    const loadedTypes = fileLoader(typesPath, { recursive: true, extensions: ['.gql'] });

    expect(loadedTypes.length).not.toEqual(loadedTypesWithOtherLogic.length)
  })

  it('should merge successfully parsed type', () => {
    const typesPath = path.join(__dirname, 'graphql/type_with_other_scripts')
    const loadedTypes = fileLoader(typesPath, { recursive: true });
    const mergedTypes = mergeTypes(loadedTypes, { all: true })

    const expectedSchemaType = normalizeWhitespace(`
      type Query {
        groot: Groot
      }
      type Groot {
        id: ID!
        status: String
      }
    `)
    const schema = normalizeWhitespace(mergedTypes);

    expect(schema).toContain(expectedSchemaType);
  });
})