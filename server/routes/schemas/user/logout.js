const { sessionMiddleware } = require('../../../utils/middlewares');

module.exports = {
  method: 'post',
  paths: '/logout',
  middlewares: sessionMiddleware,
  errorMessage: 'Bad parameters'
};
