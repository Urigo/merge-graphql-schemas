const mergeTypes = (types) => {
  const sliceDefaultTypes = operation =>
    types.map((type) => {
      const startIndex = `type ${operation} {`.length + type.indexOf(`type ${operation} {`);
      const endIndex = type.indexOf('}', startIndex);
      return type.slice(startIndex, endIndex - 1);
    }).join(' ');

  const sliceCustomTypes = () =>
    types.map((type) => {
      const extractedType = /type (?!Query)(?!Mutation)([\s\S]*?) {/.exec(type);
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

  return [schema, ...sliceCustomTypes()];
};

export default mergeTypes;
