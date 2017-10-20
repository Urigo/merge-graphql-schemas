import fs from 'fs';
import path from 'path';

const recursiveReadDirSync = dir =>
  fs.readdirSync(dir)
    .reduce((files, file) => (
      fs.statSync(path.join(dir, file)).isDirectory() ?
        files.concat(recursiveReadDirSync(path.join(dir, file))) :
        files.concat(path.join(dir, file))
      ),
      []);

const readDirSync = dir =>
  fs.readdirSync(dir)
    .reduce((files, file) => (
      fs.statSync(path.join(dir, file)).isDirectory() ?
        files :
        files.concat(path.join(dir, file))
      ),
      []);

const fileLoader = (folderPath, options = {}) => {
  const recursive = options.recursive ? options.recursive : false;
  const extForScript = options.extForScript ? options.extForScript : ['.ts', '.js'];
  const extForGraphql = options.extForGraphql ? options.extForGraphql : ['.graphqls', '.gql', '.graphql'];

  const dir = folderPath;
  const files = [];
  const schemafiles = recursive === true ?
                  recursiveReadDirSync(dir) :
                  readDirSync(dir);

  schemafiles.forEach((f) => {
    const pathObj = path.parse(f);

    if (pathObj.name.toLowerCase() === 'index') { return; }

    if (extForScript.includes(pathObj.ext)) {
      const file = require(f); // eslint-disable-line
      files.push(file.default || file);
    } else if (extForGraphql.includes(pathObj.ext)) {
      const file = fs.readFileSync(f, 'utf8');
      files.push(file.toString());
    }
  });
  return files;
};

export default fileLoader;
