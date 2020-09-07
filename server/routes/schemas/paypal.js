const joi = require('@hapi/joi');

const { sessionMiddleware } = require('../../utils/middlewares');
const { PACKS } = require('../actions/paypal/constants');

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
      pack_name: joi
        .string()
        .valid(...Object.keys(PACKS))
        .required()
    })
  },
  activatePayment: {
    method: 'post',
    paths: '/paypal/activate_payment',
    middlewares: sessionMiddleware,
    errorMessage: 'Bad parameters',
    body: joi.object().keys({
      order_id: joi.string().required()
    })
  }
};
