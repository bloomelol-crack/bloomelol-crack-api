const joi = require('@hapi/joi');

const { stream } = require('../../utils/redis');

module.exports = {
  setCredentials: {
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
      count: joi.number().min(1).max(1000).required()
    }),
    admin: true
  },
  updateAccounts: {
    method: 'put',
    paths: '/lol_accounts/update',
    body: joi.string().required(),
    admin: true
  }
};
