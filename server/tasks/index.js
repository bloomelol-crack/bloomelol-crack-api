const moment = require('moment');

const fs = require('fs');

const now = moment();

fs.readdir(__dirname, (error, files) =>
  files.filter(file => file !== 'index.js').forEach(file => require(`./${file}`))
);
