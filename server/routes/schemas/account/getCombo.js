const joi = require('@hapi/joi');

module.exports = {
  method: 'post',
  paths: '/lol_accounts/combo.txt',
  body: joi.object().keys({
    region: joi
      .string()
      .valid('jp', 'las', 'www', 'na', 'euw', 'eune', 'oce', 'br', 'lan', 'ru', 'tr', 'any')
      .required(),
    min_level: joi.number().required(),
    count: joi.number().min(1).max(1000).required()
  }),
  admin: true
};
