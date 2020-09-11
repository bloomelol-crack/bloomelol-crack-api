const Aws = require('aws-sdk');

const env = require('../../env.json');

const { SES_REGION, SES_ACCESS_KEY, SES_SECRET_KEY } = env;
const { SNS_REGION, SNS_ACCESS_KEY, SNS_SECRET_KEY } = env;

const ses = new Aws.SES({
  accessKeyId: SES_ACCESS_KEY,
  secretAccessKey: SES_SECRET_KEY,
  region: SES_REGION
});

const sns = new Aws.SNS({
  accessKeyId: SNS_ACCESS_KEY,
  secretAccessKey: SNS_SECRET_KEY,
  region: SNS_REGION
});

module.exports = { ses, sns };
