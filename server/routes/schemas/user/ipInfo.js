const joi = require('@hapi/joi');

module.exports = {
  method: 'get',
  paths: '/ip_info/:ip',
  params: joi.object().keys({
    ip: joi.string().ip().required()
  })
};
