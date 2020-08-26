const moment = require('moment');

const fs = require('fs');

const now = moment();

fs.readdir(__dirname, (error, files) =>
  files.filter(file => file !== 'index.js' && file.slice(-3) === '.js').forEach(file => require(`./${file}`))
);
