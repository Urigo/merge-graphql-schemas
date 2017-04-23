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

  const inputTypeRegEx = /input ([\s\S]*?) {/g;
  const enumTypeRegEx = /enum ([\s\S]*?) {/g;
  const customTypeRegEx = /type (?!Query)(?!Mutation)([\s\S]*?) {/g;

  const sliceTypes = (regexp) => {
    const inputs = [];
    types.forEach((type) => {
      const extractedInputs = type.match(regexp);
      if (extractedInputs !== null) {
        extractedInputs.forEach((input) => {
          const startIndex = type.indexOf(input);
          const endIndex = type.indexOf('}', startIndex);
          inputs.push(type.slice(startIndex, endIndex + 1));
        });
      }
    });
    return inputs;
  };

  const inputTypes = sliceTypes(inputTypeRegEx).filter(Boolean);
  const enumTypes = sliceTypes(enumTypeRegEx).filter(Boolean);
  const customTypes = sliceTypes(customTypeRegEx).filter(Boolean);

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

  let allTypes = [];
  if (inputTypes.length !== 0) { allTypes = allTypes.concat(inputTypes); }
  if (enumTypes.length !== 0) { allTypes = allTypes.concat(enumTypes); }
  if (customTypes.length !== 0) { allTypes = allTypes.concat(customTypes); }

  validateSchema(schema, allTypes);

  return [schema, ...allTypes];
};

export default mergeTypes;
