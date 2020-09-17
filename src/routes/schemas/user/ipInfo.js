import joi from '@hapi/joi';

export const ipInfo = {
  method: 'get',
  paths: '/ip_info/:ip',
  params: joi.object().keys({
    ip: joi.string().ip().required()
  })
};
