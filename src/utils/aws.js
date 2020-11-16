import Aws from 'aws-sdk';

import env from '../env.json';

const { SES_REGION, SES_ACCESS_KEY, SES_SECRET_KEY } = env;

const ses = new Aws.SES({
  accessKeyId: SES_ACCESS_KEY,
  secretAccessKey: SES_SECRET_KEY,
  region: SES_REGION
});

globalThis.aws = { ses };
