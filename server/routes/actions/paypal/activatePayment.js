const rollbar = require('../../../utils/rollbar');
const { account, paypalPayment } = require('../../../database/models');
const { socketIo } = require('../../socket.io');
const { broadcast } = require('../../socket.io/all_accounts/constants');

module.exports = async (req, res) => {
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
};
