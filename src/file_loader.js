import fs from 'fs';
import path from 'path';

const fileLoader = (folderPath) => {
  const dir = folderPath;
  const files = [];
  fs.readdirSync(dir).forEach((f) => {
    const ext = path.extname(f);
    const filesDir = path.join(dir, f);

    switch (ext) {
      case '.js': {
        const file = require(filesDir); // eslint-disable-line
        files.push(file.default);
        break;
      }

      case '.graphqls':
      case '.graphql': {
        const file = fs.readFileSync(filesDir);
        files.push(file.toString());
        break;
      }

      default:
    }
  });
  return files;
};

export default fileLoader;
