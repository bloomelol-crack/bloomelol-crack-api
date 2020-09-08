const joi = require('@hapi/joi');

const { sessionMiddleware } = require('../../../utils/middlewares');

module.exports = {
  method: 'get',
  paths: '/paypal/order',
  middlewares: sessionMiddleware,
  errorMessage: 'Bad parameters',
  query: joi.object().keys({
    account_id: joi.string().required()
  })
};
