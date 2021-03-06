import env from '../../env.json';
import { getToken } from './token';

export const captureOrder = async order_id => {
  const token = await getToken();
  if (!token) return null;
  const options = {
    url: `${env.PAYPAL_URL}/v2/checkout/orders/${encodeURIComponent(order_id)}/capture`,
    method: 'post',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  };
  const response = await request.axios({ options });
  if (!response || response.status < 200 || response.status > 299) {
    logError(
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
