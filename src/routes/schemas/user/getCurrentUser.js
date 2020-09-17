import { sessionMiddleware } from 'utils/middlewares';

export const getCurrentUser = {
  method: 'get',
  paths: '/session/current_user',
  middlewares: sessionMiddleware,
  errorMessage: 'Bad parameters'
};
