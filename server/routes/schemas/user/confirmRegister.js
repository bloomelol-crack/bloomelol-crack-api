const joi = require('@hapi/joi');

const { sessionMiddleware } = require('../../../utils/middlewares');

module.exports = {
  method: 'get',
  paths: '/confirm_register/:confirmID',
  middlewares: sessionMiddleware,
  params: joi.object().keys({
    confirmID: joi.string().required()
  })
};
