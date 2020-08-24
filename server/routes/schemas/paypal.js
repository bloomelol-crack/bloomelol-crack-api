const joi = require('@hapi/joi');

module.exports = {
  getPaymentLink: {
    method: 'get',
    paths: '/paypal/payment_link',
    // errorMessage: 'Bad parameters',
    query: joi.object().keys({
      account_id: joi.string().required()
    })
  }
};
