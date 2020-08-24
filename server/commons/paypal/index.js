const uuid = require('uuidv4');

const { axios } = require('../request');
const env = require('../../../env.json');

const { getToken } = require('./token');

const [webUrl] = env.WEB_ORIGINS.split(/\s*,\s*/g);

const getPayLink = async (price, currency) => {
  const token = await getToken();
  price = price.toString();
  if (!token) return null;
  const response = await axios({
    url: `${env.PAYPAL_URL}/v1/payments/payment`,
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    data: {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      transactions: [
        {
          amount: {
            total: price,
            currency
          },
          payment_options: {
            allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
          },
          item_list: {
            items: [
              {
                name: `computing service - ${uuid()}`,
                description: `computing service - ${uuid()}`,
                quantity: '1',
                price,
                currency
              }
            ]
          }
        }
      ],
      redirect_urls: {
        return_url: `${webUrl}/payment_completed`,
        cancel_url: `${webUrl}/payment_cancelled`
      }
    }
  });
};
