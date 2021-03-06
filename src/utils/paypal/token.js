import env from '../../env.json';

let token = null;

const updateToken = async () => {
  const options = {
    url: `${env.PAYPAL_URL}/v1/oauth2/token`,
    method: 'post',
    params: { grant_type: 'client_credentials' },
    auth: { username: env.PAYPAL_CLIENT_ID, password: env.PAYPAL_SECRET }
  };
  const response = await request.axios({ options });
  if (!response || response.status !== 200) {
    rollbar.error(
      `Failed to get PayPal token.\nRequest:\n${JSON.stringify(
        options,
        null,
        2
      )}\nResponse:\n${JSON.stringify(response, null, 2)}`
    );
    return null;
  }
  const { access_token, expires_in } = response.body;
  const nextUpdateIn = 8000 || Math.max(expires_in * 1000 || 0, 25000);
  setTimeout(updateToken, nextUpdateIn);
  token = access_token;
};

export const getToken = async ({ _tries = 8 } = {}) => {
  if (!token) await updateToken();
  if (!token && _tries >= 0) {
    await wait(5000);
    return getToken({ _tries });
  }
  return token;
};
