import validateSchema from './validate_schema';

const mergeTypes = (types) => {
  const sliceDefaultTypes = operation =>
    types.map((type) => {
      const regexp = new RegExp(`type ${operation} {(.*?)}`, 'gim');
      const extractedType = type.replace(/(\s)+/gim, ' ').match(regexp);
      if (extractedType != null && extractedType.length > 0) {
        const startIndex = extractedType[0].indexOf('{') + 1;
        const endIndex = extractedType[0].indexOf('}') - 1;
        return extractedType[0].slice(startIndex, endIndex);
      }
      return '';
    }).join(' ');

  const sliceCustomTypes = () =>
    types.map((type) => {
      const extractedType = /type (?!Query)(?!Mutation)([\s\S]*?) {/.exec(type);
      if (extractedType === null) { return ''; }
      const startIndex = extractedType.index;
      const endIndex = type.indexOf('}', startIndex);
      return type.slice(startIndex, endIndex + 1);
    });

  const sliceInputTypes = () =>
    types.map((type) => {
      const extractedType = /input ([\s\S]*?) {/.exec(type);
      if (extractedType === null) { return ''; }
      const startIndex = extractedType.index;
      const endIndex = type.indexOf('}', startIndex);
      return type.slice(startIndex, endIndex + 1);
    });

  const schema = `
    schema {
      query: Query,
      mutation: Mutation
    }

    type Query {
      ${sliceDefaultTypes('Query')}
    }

    type Mutation {
      ${sliceDefaultTypes('Mutation')}
    }
  `;

  let customTypes = sliceCustomTypes().filter(Boolean);
  const inputTypes = sliceInputTypes().filter(Boolean);
  if (inputTypes.length !== 0) { customTypes = customTypes.concat(inputTypes); }

  validateSchema(schema, customTypes);

  return [schema, ...customTypes];
};

export default mergeTypes;
