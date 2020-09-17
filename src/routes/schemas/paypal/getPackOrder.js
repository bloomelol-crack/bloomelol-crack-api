import joi from '@hapi/joi';

import { sessionMiddleware } from 'utils/middlewares';
import { PACKS } from 'routes/actions/paypal/constants';
import { REGIONS } from 'Constants';

export const getPackOrder = {
  method: 'get',
  paths: '/paypal/pack_order',
  middlewares: sessionMiddleware,
  errorMessage: 'Bad parameters',
  query: joi.object().keys({
    pack_name: joi
      .string()
      .valid(...Object.keys(PACKS))
      .required(),
    region: joi
      .string()
      .valid(...REGIONS)
      .required()
  })
};
