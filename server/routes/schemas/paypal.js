const joi = require('@hapi/joi');

const { sessionMiddleware } = require('../../utils/middlewares');
const { PACK_TYPES } = require('../actions/paypal/constants');

module.exports = {
  getAccountOrder: {
    method: 'get',
    paths: '/paypal/order',
    middlewares: sessionMiddleware,
    errorMessage: 'Bad parameters',
    query: joi.object().keys({
      account_id: joi.string().required()
    })
  },
  getPackOrder: {
    method: 'get',
    paths: '/paypal/pack_order',
    middlewares: sessionMiddleware,
    errorMessage: 'Bad parameters',
    query: joi.object().keys({
      pack_type: joi
        .string()
        .valid(...Object.values(PACK_TYPES))
        .required()
    })
  },
  activatePayment: {
    method: 'post',
    paths: '/paypal/activate_payment',
    errorMessage: 'Bad parameters',
    body: joi.object().keys({
      order_id: joi.string().required(),
      account_id: joi.string().required()
    })
  }
};
