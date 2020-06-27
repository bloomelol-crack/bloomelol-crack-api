const joi = require('@hapi/joi');

require('../../commons/env');

module.exports = {
  report: {
    method: 'post',
    paths: '/activity',
    domains: process.env.DOMAIN_NAME,
    errorMessage: 'Bad parameters',
    body: joi.object().keys({
      paymentReference: joi.string().required(),
      name: joi.string(),
      email: joi.string().required(),
      subject: joi.string().required(),
      message: joi.string().required()
    })
  }
};
