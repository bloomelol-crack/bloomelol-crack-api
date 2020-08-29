import fs from 'fs';

fs.readdir(__dirname, (_: any, files: string[]) =>
  files.filter(file => file !== 'index.js').forEach(file => require(`./${file}`))
);
