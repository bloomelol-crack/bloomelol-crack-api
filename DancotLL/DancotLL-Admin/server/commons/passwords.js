const bcrypt = require('bcryptjs');

const encrypt = pass =>
  new Promise(resolve => bcrypt.hash(pass, 6, (err, hash) => resolve(err ? null : hash)));

module.exports = { encrypt };
