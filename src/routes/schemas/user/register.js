import joi from '@hapi/joi';

import { sessionMiddleware } from 'utils/middlewares';

export const register = {
  method: 'post',
  paths: '/register',
  middlewares: sessionMiddleware,
  errorMessage: 'Bad parameters',
  body: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().required(),
    name: joi.string().required(),
    surname: joi.string().required()
  })
};
