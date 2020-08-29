import db from 'database/index';
import env from 'env/';
import rollbar from 'utils/rollbar';
import { isArray } from 'utils/types';
import { axios } from 'utils/request';
import { getToken } from 'utils/paypal/token';

const [webUrl] = env.WEB_ORIGINS.split(/\s*,\s*/g);

export const getOrder = async (
  user_id: string,
  price: number,
  currency: string
): Promise<{ link: string | null; order: { id: string; status: string } | null }> => {
  if (!price || !currency) {
    rollbar.error(`Tried to create a payment with price "${price}" and currency ${currency}`);
    return { link: null, order: null };
  }
  const token = await getToken();
  const strPrice = price.toFixed(2);
  if (!token) return { link: null, order: null };
  const options = {
    url: `${env.PAYPAL_URL}/v2/checkout/orders`,
    method: <'post'>'post',
    headers: { Authorization: `Bearer ${token}` },
    data: {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: strPrice
          }
        }
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
        brand_name: 'BloomeBot Store',
        user_action: 'PAY_NOW',
        return_url: `${webUrl}/payment_completed`
      }
    }
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
      `Failed to get PayPal payment link.\nRequest:\n${JSON.stringify(
        options,
        null,
        2
      )}\nResponse:\n${JSON.stringify(response, null, 2)}`
    );
    return { link: null, order: null };
  }
  const [{ href: Link }] = response.body.links.filter((l: { rel: string }) => l.rel === 'approve');
  const { id: OrderID, status: OrderStatus } = response.body;
  db.paypalPayment?.save({
    UserID: user_id,
    OrderID,
    OrderStatus,
    Amount: price,
    Currency: currency,
    Link,
    Active: false
  });
  return { link: Link, order: response.body };
};
