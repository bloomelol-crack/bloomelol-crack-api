const { sessionMiddleware } = require('../../../utils/middlewares');

module.exports = {
  method: 'get',
  paths: '/session/current_user',
  middlewares: sessionMiddleware,
  errorMessage: 'Bad parameters'
};
