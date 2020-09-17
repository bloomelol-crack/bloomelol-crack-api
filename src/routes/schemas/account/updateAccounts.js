import joi from '@hapi/joi';

export const updateAccounts = {
  method: 'put',
  paths: '/lol_accounts/update',
  body: joi.string().required(),
  admin: true
};
