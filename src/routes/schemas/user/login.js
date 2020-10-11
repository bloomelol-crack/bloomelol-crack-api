import joi from '@hapi/joi';

export const login = {
  method: 'post',
  paths: '/login',
  middlewares: middlewares.sessionMiddleware,
  errorMessage: 'Bad parameters',
  body: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().required()
  })
};
