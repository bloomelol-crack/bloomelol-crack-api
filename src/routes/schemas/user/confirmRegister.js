import joi from '@hapi/joi';

import { sessionMiddleware } from 'utils/middlewares';

export const confirmRegister = {
  method: 'get',
  paths: '/confirm_register/:confirmID',
  middlewares: sessionMiddleware,
  params: joi.object().keys({
    confirmID: joi.string().required()
  })
};
