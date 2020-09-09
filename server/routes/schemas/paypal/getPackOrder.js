const joi = require('@hapi/joi');

const { sessionMiddleware } = require('../../../utils/middlewares');
const { PACKS } = require('../../actions/paypal/constants');
const { REGIONS } = require('../../../constants');

module.exports = {
  method: 'get',
  paths: '/paypal/pack_order',
  middlewares: sessionMiddleware,
  errorMessage: 'Bad parameters',
  query: joi.object().keys({
    pack_name: joi
      .string()
      .valid(...Object.keys(PACKS))
      .required(),
    region: joi
      .string()
      .valid(...REGIONS)
      .required()
  })
};
