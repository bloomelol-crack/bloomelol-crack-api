/* eslint-disable global-require */
const Rollbar = require('rollbar');

const env = require('../../env.json');

module.exports = new Rollbar({
  accessToken: env.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: env.NODE_ENV,
  verbose: true,
  itemsPerMinute: 500,
  maxItems: 500000
});
