const { sessionMiddleware } = require('../../../utils/middlewares');

module.exports = {
  method: 'get',
  paths: '/session/current_language',
  middlewares: sessionMiddleware,
  errorMessage: 'Bad parameters'
};
