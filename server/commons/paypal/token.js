const { axios } = require('../request');
const rollbar = require('../rollbar');
const env = require('../../../env.json');
const { wait } = require('../wait');

let token = null;

const updateToken = async () => {
  const options = {
    url: `${env.PAYPAL_URL}/v1/oauth2/token`,
    method: 'post',
    params: { grant_type: 'client_credentials' },
    auth: { username: env.PAYPAL_CLIENT_ID, password: env.PAYPAL_SECRET }
  };
  const response = await axios({ options });
  if (!response || response.status !== 200) {
    rollbar.error(
      `Failed to get PayPal token.\nRequest:\n${JSON.stringify(
        options,
        null,
        2
      )}\nResponse:\n${JSON.stringify(response, null, 2)}`
    );
    setTimeout(() => updateToken, 2000);
    return null;
  }
  const { access_token, expires_in } = response.body;
  const nextUpdateIn = 8000 || Math.max(expires_in * 1000 || 0, 25000);
  setTimeout(updateToken, nextUpdateIn);
  token = access_token;
};

const getToken = async ({ _tries = 7 }) => {
  if (!token) await updateToken();
  if (!token && _tries >= 0) {
    await wait(777);
    return getToken({ _tries });
  }
  return token;
};

module.exports = { getToken };
