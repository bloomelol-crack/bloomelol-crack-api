const { uuid } = require('uuidv4');

const { axios } = require('../request');
const rollbar = require('../rollbar');
const env = require('../../../env.json');
const { paypalPayment } = require('../../database/models');

const { getToken } = require('./token');

const getPaymentStatus = async order_id => {
  const token = await getToken();
  if (!token) return null;
  const options = {
    url: `${env.PAYPAL_URL}/v2/checkout/orders/${encodeURIComponent(order_id)}`,
    method: 'get',
    headers: { Authorization: `Bearer ${token}` }
  };
  return axios({ options });
};

module.exports = { getPaymentStatus };
