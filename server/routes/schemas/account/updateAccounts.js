const joi = require('@hapi/joi');

module.exports = {
  method: 'put',
  paths: '/lol_accounts/update',
  body: joi.string().required(),
  admin: true
};
