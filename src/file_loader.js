import fs from 'fs';
import path from 'path';

const fileLoader = (folderPath) => {
  const dir = path.join(__dirname, folderPath);
  const files = [];
  fs.readdirSync(dir).forEach((f) => {
    const filesDir = path.join(dir, f);
    const file = require(filesDir); // eslint-disable-line
    files.push(file);
  });
  return files;
};

export default fileLoader;
