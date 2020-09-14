const joi = require('@hapi/joi');

module.exports = {
  method: 'post',
  paths: '/log',
  body: joi.object().keys({
    data: joi.required()
  })
};
