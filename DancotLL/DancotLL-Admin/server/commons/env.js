/* eslint-disable global-require */
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'localhost') {
  require('dotenv').config({ path: 'localhost.env' });
}

module.exports = process.env;
