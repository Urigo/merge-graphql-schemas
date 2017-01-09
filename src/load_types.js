import fs from 'fs';
import path from 'path';

const loadTypes = (options) => {
  
  const typesFolder = options.typesFolder || '../graphql/types';

  const dir = path.join(__dirname, typesFolder);
  const types = [];
  fs.readdirSync(dir).forEach((file) => {
    const typesDir = path.join(dir, file);
    const type = require(typesDir);
    types.push(type);
  });
  return types;
};

export default loadTypes;
