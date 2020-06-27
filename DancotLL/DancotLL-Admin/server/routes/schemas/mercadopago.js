const joi = require('@hapi/joi');

require('../../commons/env');

module.exports = {
  // createPayment: {
  //   method: 'post',
  //   paths: '/mercadopago/payment',
  //   domains: process.env.DOMAIN_NAME,
  //   errorMessage: 'Bad parameters',
  //   body: joi.object().keys({ productName: joi.string().required() })
  // },
  // notification: {
  //   method: 'post',
  //   paths: '/mercadopago/notification',
  //   errorMessage: 'Bad parameters',
  //   body: joi.object().keys({})
  // }
};
