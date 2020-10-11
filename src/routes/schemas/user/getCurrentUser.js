export const getCurrentUser = {
  method: 'get',
  paths: '/session/current_user',
  middlewares: middlewares.sessionMiddleware,
  errorMessage: 'Bad parameters'
};
