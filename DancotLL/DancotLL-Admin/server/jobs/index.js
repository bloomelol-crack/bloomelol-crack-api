const fs = require('fs');

if (+process.env.threadID === 1)
  fs.readdirSync(__dirname)
    .filter(file => file !== 'index.js' && file.slice(-3) === '.js')
    .forEach(file => require(`./${file}`));
