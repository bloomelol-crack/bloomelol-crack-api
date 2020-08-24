const { uuid } = require('uuidv4');

const { axios } = require('../request');
const rollbar = require('../rollbar');
const env = require('../../../env.json');
const { paypalPayment } = require('../../database/models');

const { getToken } = require('./token');

const [webUrl] = env.WEB_ORIGINS.split(/\s*,\s*/g);

const getOrder = async (price, currency) => {
  if (!price || !currency) {
    rollbar.error(`Tried to create a payment with price "${price}" and currency ${currency}`);
    return null;
  }
  const token = await getToken();
  const strPrice = price.toString();
  if (!token) return null;
  const options = {
    url: `${env.PAYPAL_URL}/v2/checkout/orders`,
    method: 'post',
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
  if (!response || response.status < 200 || response.status > 299) {
    rollbar.error(
      `Failed to get PayPal token.\nRequest:\n${JSON.stringify(
        options,
        null,
        2
      )}\nResponse:\n${JSON.stringify(response, null, 2)}`
    );
    return null;
  }
  const [{ href: Link }] = response.body.links.filter(l => l.rel === 'approve');
  const { id: OrderID, status: OrderStatus } = response.body;
  paypalPayment.save({
    OrderID,
    OrderStatus,
    Amount: price,
    Currency: currency,
    Link,
    Active: false
  });
  return { link: Link, orderId: OrderID };
};

module.exports = { getOrder };
