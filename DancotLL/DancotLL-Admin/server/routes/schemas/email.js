const joi = require('@hapi/joi');

require('../../commons/env');

module.exports = {
  send: {
    method: 'post',
    paths: '/emails',
    domains: process.env.DOMAIN_NAME,
    errorMessage: 'Bad parameters',
    body: joi.object().keys({
      from: joi.string(),
      to: joi.string(),
      subject: joi.string().required(),
      html: joi.string().required(),
      text: joi.string().required()
    })
  },
  sendTemplate: {
    method: 'post',
    paths: '/emails/:templateName',
    errorMessage: 'Bad parameters',
    params: joi.object().keys({ templateName: joi.string().required() }),
    body: joi.object().keys({
      from: joi.string(),
      to: joi.string(),
      subject: joi.string().required(),
      data: joi.object().required()
    }),
    query: joi.object().keys({ lang: joi.string() })
  }
};
