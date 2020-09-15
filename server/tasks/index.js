const fs = require('fs');

fs.readdir(__dirname, (error, files) =>
  files.filter(file => file !== 'index.js').forEach(file => require(`./${file}`))
);
