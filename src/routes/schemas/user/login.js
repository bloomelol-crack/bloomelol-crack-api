import joi from '@hapi/joi';

import { sessionMiddleware } from 'utils/middlewares';

export const login = {
  method: 'post',
  paths: '/login',
  middlewares: sessionMiddleware,
  errorMessage: 'Bad parameters',
  body: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().required()
  })
};
