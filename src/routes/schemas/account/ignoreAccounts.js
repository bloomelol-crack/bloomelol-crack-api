import joi from '@hapi/joi';

export const ignoreAccounts = {
  method: 'put',
  paths: '/lol_accounts/ignore/:region',
  body: joi.string().required(),
  admin: true
};
