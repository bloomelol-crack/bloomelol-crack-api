const joi = require('@hapi/joi');

module.exports = {
  method: 'put',
  paths: '/lol_accounts/ignore/:region',
  body: joi.string().required(),
  admin: true
};
