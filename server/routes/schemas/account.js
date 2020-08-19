const joi = require('@hapi/joi');

const { sessionMiddleware } = require('../../commons/middlewares');
require('../../commons/env');

module.exports = {
  login: {
    method: 'post',
    paths: '/login',
    middlewares: sessionMiddleware,
    errorMessage: 'Bad parameters',
    body: joi.object().keys({
      email: joi.string().email().required(),
      password: joi.string().required()
    })
  },
  logout: {
    method: 'post',
    paths: '/logout',
    middlewares: sessionMiddleware,
    errorMessage: 'Bad parameters',
    body: joi.object().keys({
      email: joi.string().email().required()
    })
  }
};
