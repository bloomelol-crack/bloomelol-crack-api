import { sessionMiddleware } from 'utils/middlewares';

export const logout = {
  method: 'post',
  paths: '/logout',
  middlewares: sessionMiddleware,
  errorMessage: 'Bad parameters'
};
