const mercadopago = require('mercadopago');

const env = require('../../commons/env');
const { product } = require('../../database/models');
const rollbar = require('../../commons/rollbar');

mercadopago.configure({ access_token: env.MERCADO_PAGO_TOKEN });

module.exports = {
  createPayment: async (req, res) => {
    const { productName, reference } = req.body;
    let Product = await product.get({ Name: productName });
    if (!Product) {
      rollbar.error(`Error searching product: '${productName}'`);
      return res.status(500).json({ error: 'Error searching product' });
    }
    [Product] = Product;
    if (!Product) {
      rollbar.warn(`Product not found: '${productName}'`);
      return res.status(404).json({ error: 'Product not found' });
    }
    const { Price, Description, CurrencyID } = Product;
    const baseUrl = env.NGROK_URL || `${env.URL_PREFIX}${env.DOMAIN_NAME}`;
    const preference = {
      external_reference: reference,
      notification_url: `${baseUrl}/api/mercadopago/notification`,
      items: [
        {
          title: productName,
          currency_id: CurrencyID,
          description: Description,
          unit_price: Price,
          quantity: 1
        }
      ]
    };
    mercadopago.preferences
      .create(preference)
      .then(({ body }) => res.status(200).json(body))
      .catch(error => {
        rollbar.error(error);
        res.status(404).json({ message: 'Could not create the payment', error });
      });
  },
  notification: (req, res) => {
    console.log('Body', JSON.stringify(req.body, null, 2));
    res.status(200).send('OK');
  }
};
