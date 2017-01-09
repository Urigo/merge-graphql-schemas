import fs from 'fs';
import path from 'path';

const fileLoader = (folderPath) => {
  
  const dir = path.join(__dirname, folderPath);
  const files = [];
  fs.readdirSync(dir).forEach((file) => {
    const filesDir = path.join(dir, file);
    const file = require(filesDir);
    files.push(file);
  });
  return files;
};

export default fileLoader;
