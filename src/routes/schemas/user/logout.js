export const logout = {
  method: 'post',
  paths: '/logout',
  middlewares: middlewares.sessionMiddleware,
  errorMessage: 'Bad parameters'
};
