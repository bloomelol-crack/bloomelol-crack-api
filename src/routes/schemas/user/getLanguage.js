export const getLanguage = {
  method: 'get',
  paths: '/session/current_language',
  middlewares: middlewares.sessionMiddleware,
  errorMessage: 'Bad parameters'
};
