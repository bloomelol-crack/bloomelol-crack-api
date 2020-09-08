const joi = require('@hapi/joi');

const regions = ['jp', 'las', 'www', 'na', 'euw', 'eune', 'oce', 'br', 'lan', 'ru', 'tr', 'any'];
module.exports = {
  method: 'post',
  paths: '/lol_accounts/combo.txt',
  body: joi.object().keys({
    region: joi
      .string()
      .valid(...regions)
      .required(),
    not_in_regions: joi
      .array()
      .min(1)
      .items(joi.string().valid(...regions)),
    min_level: joi.number().required(),
    count: joi.number().min(1).max(1000).required()
  }),
  admin: true
};
