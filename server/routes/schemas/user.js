const joi = require('@hapi/joi');

const { sessionMiddleware } = require('../../utils/middlewares');

module.exports = {
  register: {
    method: 'post',
    paths: '/register',
    middlewares: sessionMiddleware,
    errorMessage: 'Bad parameters',
    body: joi.object().keys({
      email: joi.string().email().required(),
      password: joi.string().required(),
      name: joi.string().required(),
      surname: joi.string().required()
    })
  },
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
    errorMessage: 'Bad parameters'
  },
  getCurrentUser: {
    method: 'get',
    paths: '/session/current_user',
    middlewares: sessionMiddleware,
    errorMessage: 'Bad parameters'
  }
};
