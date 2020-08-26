const env = require('../../../env.json');
const { getOrder } = require('../../utils/paypal');
const { getAccountPrice } = require('../../utils/account');
const rollbar = require('../../utils/rollbar');
const { account, paypalPayment } = require('../../database/models');
const { socketIo } = require('../socket.io');
const { broadcast } = require('../socket.io/constants/account');

module.exports = {
  getOrder: async (req, res) => {
    const { account_id } = req.query;
    const { _id: user_id } = req.session.user;

    const Accounts = await account.get({ _id: account_id });
    if (!Accounts) return res.status(500).json({ error: 'Error searching Account' });
    if (!Accounts.length) return res.status(404).json({ error: 'Account not found' });
    const [Account] = Accounts;
    const price = getAccountPrice(Account);
    if (price <= 0) return res.status(500).json({ error: 'There was a problem with price calculation' });
    const { link, order } = await getOrder(user_id, price, 'USD');
    if (!link) return res.status(500).json({ error: 'Could not get a payment link' });
    res.status(200).json({ payment_link: link, order_id: order.id });
  },
  activatePayment: async (req, res) => {
    const { order_id, account_id } = req.body;
    const Payments = await paypalPayment.get({ OrderID: order_id });

    if (!Payments) return res.status(500).json({ error: 'Error searching Payment' });
    if (!Payments.length) return res.status(404).json({ error: 'Payment not found' });
    const [Payment] = Payments;
    if (Payment.Active) return res.status(409).json({ message: 'Order was already activated' });
    const accountUpdated = await account.update(
      { _id: account_id, PaypalPaymentID: { $exists: false }, UserID: { $exists: false } },
      { $set: { PaypalPaymentID: Payment._id } }
    );
    if (!accountUpdated) return res.status(422).json({ error: 'Account is not available' });
    res.status(200).json({ message: 'The order was activated' });
    socketIo.emit(broadcast.ACCOUNT_TAKEN, account_id);
    const paymentUpdated = await paypalPayment.update({ _id: Payment._id }, { $set: { Active: true } });
    if (!paypalPayment) rollbar.error(`Could not activate payment with id "${Payment._id}"`);
  }
};
