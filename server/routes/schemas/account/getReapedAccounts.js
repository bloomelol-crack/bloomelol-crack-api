const joi = require('@hapi/joi');

module.exports = {
  method: 'get',
  paths: '/lol_accounts/reaped',
  query: joi.object().keys({
    count: joi.number().min(1).max(1000).required()
  }),
  admin: true
};
