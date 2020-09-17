const { uuid } = require('uuidv4');

const { axios } = require('../request');
const rollbar = require('../rollbar');
const env = require('../../../env.json');
const { paypalPayment } = require('../../database/models');

const { getToken } = require('./token');
const { getRandomService } = require('./constants');

const [webUrl] = env.WEB_ORIGINS.split(/\s*,\s*/g);

/**
 * Creates an order and returns its link an
 * @param {string} user_id
 * @param {number} price
 * @param {string} currency
 * @returns {{link: string, order: {id: string, status: string}}>}
 */
const getOrder = async (user_id, price, currency) => {
  if (!price || !currency) {
    rollbar.error(`Tried to create a payment with price "${price}" and currency ${currency}`);
    return { link: null, order: null };
  }
  const token = await getToken();
  const strPrice = price.toFixed(2);
  if (!token) return { link: null, order: null };
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
        brand_name: `BloomeBot: ${getRandomService()}`,
        user_action: 'PAY_NOW',
        return_url: `${webUrl}/dashboard/my_accounts`
      }
    }
  };
  const response = await axios({ options });
  if (!response || response.status < 200 || response.status > 299) {
    rollbar.error(
      `Failed to get PayPal payment link.\nRequest:\n${JSON.stringify(
        options,
        null,
        2
      )}\nResponse:\n${JSON.stringify(response, null, 2)}`
    );
    return { link: null, order: null };
  }
  const [{ href: Link }] = response.body.links.filter(l => l.rel === 'approve');
  const { id: OrderID, status: OrderStatus } = response.body;
  paypalPayment.save({
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

module.exports = { getOrder };
