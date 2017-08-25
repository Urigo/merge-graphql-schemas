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

    switch (pathObj.ext) {
      case '.js': {
        const file = require(f); // eslint-disable-line
        files.push(file.default || file);
        break;
      }

      case '.graphqls':
      case '.gql':
      case '.graphql': {
        const file = fs.readFileSync(f, 'utf8');
        files.push(file.toString());
        break;
      }

      default:
    }
  });
  return files;
};

export default fileLoader;
