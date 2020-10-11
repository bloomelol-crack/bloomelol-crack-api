import joi from '@hapi/joi';

export const confirmRegister = {
  method: 'get',
  paths: '/confirm_register/:confirmID',
  middlewares: middlewares.sessionMiddleware,
  params: joi.object().keys({
    confirmID: joi.string().required()
  })
};
