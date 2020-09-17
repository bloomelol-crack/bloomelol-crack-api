import joi from '@hapi/joi';

export const getReapedAccounts = {
  method: 'get',
  paths: '/lol_accounts/reaped',
  query: joi.object().keys({
    count: joi.number().min(1).max(1000).required()
  }),
  admin: true
};
