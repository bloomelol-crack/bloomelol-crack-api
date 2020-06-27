const joi = require('@hapi/joi');
const { isValidObjectId } = require('mongoose');

require('../../commons/env');

module.exports = {
  create: {
    method: 'post',
    paths: '/recipients',
    domains: process.env.DOMAIN_NAME,
    errorMessage: 'Bad parameters',
    body: joi.object().keys({
      email: joi.string().required(),
      phone: joi.string().required()
    })
  },
  list: {
    method: 'get',
    paths: '/recipients',
    domains: process.env.DOMAIN_NAME,
    errorMessage: 'Bad parameters'
  },
  delete: {
    method: 'delete',
    paths: '/recipients/:_id',
    domains: process.env.DOMAIN_NAME,
    errorMessage: 'Bad parameters',
    params: joi.object().keys({
      _id: joi
        .string()
        .custom(str => {
          if (!str || !isValidObjectId(str)) throw new Error(`'${str}' is not a valid ObjectID`);
        })
        .required()
    })
  }
};
