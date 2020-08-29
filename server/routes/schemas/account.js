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
  }
};
