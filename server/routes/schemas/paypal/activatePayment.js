const joi = require('@hapi/joi');

const { sessionMiddleware } = require('../../../utils/middlewares');

module.exports = {
  method: 'post',
  paths: '/paypal/activate_payment',
  middlewares: sessionMiddleware
  // errorMessage: 'Bad parameters',
};
