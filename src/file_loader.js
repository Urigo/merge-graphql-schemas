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

const fileLoader = (folderPath, options = { recursive: false }) => {
  const dir = folderPath;
  const files = [];
  const schemafiles = options.recursive === true ?
                  recursiveReadDirSync(dir) :
                  readDirSync(dir);

  schemafiles.forEach((f) => {
    const pathObj = path.parse(f);

    if (pathObj.name.toLowerCase() === 'index') { return; }

    const extForScript = options.extForScript ? options.extForScript : ['.ts', 'js'];
    const extForGraphql = options.extForGraphql ? options.extForGraphql : ['.graphqls', '.gql', '.graphql'];

    if (extForScript.findIndex(v => v === pathObj.ext) !== -1) {
      const file = require(f); // eslint-disable-line
      files.push(file.default || file);
    }
    else if (extForGraphql.findIndex((v => v === pathObj.ext) !== -1)) {
      const file = fs.readFileSync(f, 'utf8');
      files.push(file.toString());
    }
  });
  return files;
};

export default fileLoader;
