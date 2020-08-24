const env = require('../../../env.json');
const { getOrder } = require('../../utils/paypal');
const { getAccountPrice } = require('../../utils/account');
const { account, paypalPayment } = require('../../database/models');

module.exports = {
  getOrder: async (req, res) => {
    const { account_id } = req.query;

    const Accounts = await account.get({ _id: account_id });
    if (!Accounts) return res.status(500).json({ error: 'Error searching Account' });
    if (!Accounts.length) return res.status(404).json({ error: 'Account not found' });
    const [Account] = Accounts;
    const price = getAccountPrice(Account);
    if (price <= 0) return res.status(500).json({ error: 'There was a problem with price calculation' });
    const { link, orderId } = await getOrder(price, 'USD');
    if (!link) return res.status(500).json({ error: 'Could not get a payment link' });
    res.status(200).json({ payment_link: link, order_id: orderId });
  },
  activatePayment: async (req, res) => {
    const { order_id } = req.body;
    const Payments = await paypalPayment.get({ OrderID: order_id });

    if (!Payments) return res.status(500).json({ error: 'Error searching Payment' });
    if (!Payments.length) return res.status(404).json({ error: 'Payment not found' });
    const [Payment] = Payments;
    if (Payment.Active) return res.status(200).json({ message: 'Order was already activated' });
    const updated = await paypalPayment.update({ _id: Payment._id }, { $set: { Active: true } });
    if (!updated) return res.status(500).json({ error: 'Problem updpating order' });
    res.status(200).json({ message: 'The order was activated' });
  }
};
