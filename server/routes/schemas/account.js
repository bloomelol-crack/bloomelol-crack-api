const joi = require('@hapi/joi');

module.exports = {
  setCredentials: {
    method: 'post',
    paths: '/lol_accounts/set_credentials',
    admin: true,
    errorMessage: 'Bad parameters',
    body: joi.object().keys({
      emails: joi.array().items(joi.string().email()).min(1).required()
    })
  },
  getPendingAccounts: {
    method: 'get',
    paths: '/lol_accounts/pending',
    admin: true,
    errorMessage: 'Bad parameters'
  },
  getCombo: {
    method: 'post',
    paths: '/lol_accounts/combo.txt',
    body: joi.object().keys({
      region: joi
        .string()
        .valid('jp', 'las', 'www', 'na', 'euw', 'eune', 'oce', 'br', 'lan', 'ru', 'tr', 'any')
        .required(),
      min_level: joi.number().required(),
      email_verified: joi.bool().required(),
      count: joi.number().min(1).max(1000).required()
    }),
    admin: true
  }
};
