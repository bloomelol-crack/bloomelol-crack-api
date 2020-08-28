import env from 'env.json';
import { axios } from 'utils/request';
import { getToken } from 'utils/paypal/token';

export const getPaymentStatus = async (order_id: string) => {
  const token = await getToken();
  if (!token) return null;
  const options = {
    url: `${env.PAYPAL_URL}/v2/checkout/orders/${encodeURIComponent(order_id)}`,
    method: <'get'>'get',
    headers: { Authorization: `Bearer ${token}` }
  };
  return axios({ options });
};
