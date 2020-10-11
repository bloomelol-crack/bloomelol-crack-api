import joi from '@hapi/joi';

import { LANGUAGES } from './constants';

export const setLanguage = {
  method: 'post',
  paths: '/session/current_language',
  middlewares: middlewares.sessionMiddleware,
  body: joi.object().keys({
    new_language: joi
      .string()
      .valid(...Object.values(LANGUAGES))
      .required()
  }),
  errorMessage: 'Bad parameters'
};
