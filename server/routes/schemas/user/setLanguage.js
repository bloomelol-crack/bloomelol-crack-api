const joi = require('@hapi/joi');

const { sessionMiddleware } = require('../../../utils/middlewares');

const { LANGUAGES } = require('./constants');

module.exports = {
  method: 'post',
  paths: '/session/current_language',
  middlewares: sessionMiddleware,
  body: joi.object().keys({
    new_language: joi
      .string()
      .valid(...Object.values(LANGUAGES))
      .required()
  }),
  errorMessage: 'Bad parameters'
};
