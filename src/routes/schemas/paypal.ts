import joi from '@hapi/joi';

import { sessionMiddleware } from 'utils/middlewares';

module.exports = {
  getOrder: {
    method: 'get',
    paths: '/paypal/order',
    middlewares: sessionMiddleware,
    errorMessage: 'Bad parameters',
    query: joi.object().keys({
      account_id: joi.string().required()
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
