const joi = require('@hapi/joi');

const { sessionMiddleware } = require('../../../utils/middlewares');

module.exports = {
  method: 'post',
  paths: '/login',
  middlewares: sessionMiddleware,
  errorMessage: 'Bad parameters',
  body: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().required()
  })
};
