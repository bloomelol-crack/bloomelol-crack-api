import joi from '@hapi/joi';

import { PACKS, HACKS, REGIONS, PAYMENT_PLATFORMS, ORDER_TYPES } from '../../../constants';

export const getOrder = {
  method: 'get',
  paths: '/payment_order',
  middlewares: middlewares.sessionMiddleware,
  errorMessage: 'Bad parameters',
  query: joi.object().keys({
    platform: joi
      .string()
      .valid(...Object.values(PAYMENT_PLATFORMS))
      .required(),
    type: joi
      .string()
      .valid(...Object.values(ORDER_TYPES))
      .required(),
    pack_name: joi.when('type', {
      is: ORDER_TYPES.PACK,
      then: joi
        .string()
        .valid(...Object.keys(PACKS))
        .required(),
      otherwise: joi.forbidden()
    }),
    pack_region: joi.when('type', {
      is: ORDER_TYPES.PACK,
      then: joi
        .string()
        .valid(...REGIONS)
        .required(),
      otherwise: joi.forbidden()
    }),
    account_id: joi.when('type', {
      is: ORDER_TYPES.ACCOUNT,
      then: joi.string().required(),
      otherwise: joi.forbidden()
    }),
    hack_code: joi.when('type', {
      is: ORDER_TYPES.HACK,
      then: joi
        .string()
        .valid(...Object.keys(HACKS))
        .required(),
      otherwise: joi.forbidden()
    }),
    sessions: joi.when('type', {
      is: ORDER_TYPES.HACK,
      then: joi.number().min(1).max(100).required(),
      otherwise: joi.forbidden()
    }),
    licence_id: joi.when('type', {
      is: ORDER_TYPES.HACK,
      then: joi.number().required(),
      otherwise: joi.forbidden()
    })
  })
};
