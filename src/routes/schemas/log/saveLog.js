import joi from '@hapi/joi';

export const saveLog = {
  method: 'post',
  paths: '/log',
  body: joi.object().keys({
    data: joi.required()
  })
};
