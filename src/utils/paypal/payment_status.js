import env from '../../env.json';
import { getToken } from './token';

export const getPaymentStatus = async order_id => {
  const token = await getToken();
  if (!token) return null;
  const options = {
    url: `${env.PAYPAL_URL}/v2/checkout/orders/${encodeURIComponent(order_id)}`,
    method: 'get',
    headers: { Authorization: `Bearer ${token}` }
  };
  return request.axios({ options });
};
