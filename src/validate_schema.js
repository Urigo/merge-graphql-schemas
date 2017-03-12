import gql from 'graphql-tag';

const validate = (type) => {
  try {
    gql`${type}`; // eslint-disable-line
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.log('===> Error in: ', type); // eslint-disable-line
    }
    throw err;
  }
};

export default (schema, customTypes) => {
  customTypes.forEach(ct => validate(ct));
  validate(schema);
};
