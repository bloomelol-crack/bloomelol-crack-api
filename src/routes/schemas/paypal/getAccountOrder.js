import joi from '@hapi/joi';

import { sessionMiddleware } from 'utils/middlewares';

export const getAccountOrder = {
  method: 'get',
  paths: '/paypal/order',
  middlewares: sessionMiddleware,
  errorMessage: 'Bad parameters',
  query: joi.object().keys({
    account_id: joi.string().required()
  })
};
