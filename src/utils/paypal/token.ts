import { axios } from 'utils/request';
import rollbar from 'utils/rollbar';
import env from 'env.json';
import { wait } from 'utils/wait';
import { isArray } from 'utils/types';

let token: null | string = null;

const updateToken = async (): Promise<void> => {
  const options = {
    url: `${env.PAYPAL_URL}/v1/oauth2/token`,
    method: <'post'>'post',
    params: { grant_type: 'client_credentials' },
    auth: { username: env.PAYPAL_CLIENT_ID, password: env.PAYPAL_SECRET }
  };
  const response = await axios({ options });
  if (typeof response !== 'object' || !response || isArray(response) || response.status !== 200) {
    rollbar.error(
      `Failed to get PayPal token.\nRequest:\n${JSON.stringify(
        options,
        null,
        2
      )}\nResponse:\n${JSON.stringify(response, null, 2)}`
    );
    return;
  }
  const { access_token, expires_in } = response.body;
  const nextUpdateIn = 8000 || Math.max(expires_in * 1000 || 0, 25000);
  setTimeout(updateToken, nextUpdateIn);
  token = access_token;
};

export const getToken = async ({ _tries = 7 } = {}): Promise<string | null> => {
  if (!token) await updateToken();
  if (!token && _tries >= 0) {
    await wait(5000);
    return getToken({ _tries });
  }
  return token;
};
