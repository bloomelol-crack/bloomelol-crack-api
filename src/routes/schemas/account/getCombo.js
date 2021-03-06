import joi from '@hapi/joi';

import { REGIONS } from '../../../constants';

export const getCombo = {
  method: 'post',
  paths: '/lol_accounts/combo.txt',
  body: joi.object().keys({
    region: joi
      .string()
      .valid(...REGIONS)
      .required(),
    not_in_regions: joi
      .array()
      .min(1)
      .items(joi.string().valid(...REGIONS)),
    min_level: joi.number().required(),
    count: joi.number().min(1).max(1000).required()
  }),
  admin: true
};
