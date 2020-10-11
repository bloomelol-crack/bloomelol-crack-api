import joi from '@hapi/joi';

export const activate = {
  method: 'post',
  paths: '/activate_payment',
  middlewares: middlewares.sessionMiddleware,
  body: joi.object().keys({
    order_id: joi.string().required()
  })
};
