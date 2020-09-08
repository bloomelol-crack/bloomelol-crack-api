const joi = require('@hapi/joi');

module.exports = {
  method: 'post',
  paths: ['/lol_accounts/set_credentials', '/lol_accounts/set_credentials/:user_name'],
  admin: true,
  errorMessage: 'Bad parameters',
  body: joi.object().keys({
    emails: joi.array().items(joi.string().email()).min(1).required()
  }),
  params: joi.object().keys({
    user_name: joi.string()
  })
};
