import env from 'env.json';
import rollbar from 'utils/rollbar';
import { isArray } from 'utils/types';
import { axios } from 'utils/request';
import { getToken } from 'utils/paypal/token';

export const captureOrder = async (order_id: string) => {
  const token = await getToken();
  if (!token) return null;
  const options = {
    url: `${env.PAYPAL_URL}/v2/checkout/orders/${encodeURIComponent(order_id)}/capture`,
    method: <'post'>'post',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  };
  const response = await axios({ options });
  if (
    typeof response !== 'object' ||
    !response ||
    isArray(response) ||
    response.status < 200 ||
    response.status > 299
  ) {
    rollbar.error(
      `Failed to capture PayPal order.\nRequest:\n${JSON.stringify(
        options,
        null,
        2
      )}\nResponse:\n${JSON.stringify(response, null, 2)}`
    );
    return null;
  }
  return response;
};
