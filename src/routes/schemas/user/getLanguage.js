import { sessionMiddleware } from 'utils/middlewares';

export const getLanguage = {
  method: 'get',
  paths: '/session/current_language',
  middlewares: sessionMiddleware,
  errorMessage: 'Bad parameters'
};
