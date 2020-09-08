const rollbar = require('../../../utils/rollbar');
const { account, paypalPayment } = require('../../../database/models');
const { socketIo } = require('../../socket.io');
const { broadcast } = require('../../socket.io/all_accounts/constants');

module.exports = async (req, res) => {
  const { order_id, account_ids } = req.session;
  if (!order_id) return res.status(400).json({ error: 'order_id not in session' });
  if (!account_ids) return res.status(400).json({ error: 'account_ids not in session' });

  const Payments = await paypalPayment.get({ OrderID: order_id });
  if (!Payments) return res.status(500).json({ error: 'Error searching Payment' });
  if (!Payments.length) return res.status(404).json({ error: 'Payment not found' });
  const [Payment] = Payments;
  if (Payment.Active) return res.status(409).json({ message: 'Order was already activated' });
  const accountUpdated = await account.update(
    { _id: { $in: account_ids }, PaypalPaymentID: { $exists: false }, UserID: { $exists: false } },
    { $set: { PaypalPaymentID: Payment._id } }
  );
  if (accountUpdated !== account_ids.length) {
    res.status(422).json({ error: 'Not all accounts where updated' });

    return account.update(
      { _id: { $in: account_ids }, PaypalPaymentID: { $exists: false }, UserID: { $exists: false } },
      { $unset: { PaypalPaymentID: 1 } }
    );
  }
  res.status(200).json({ message: 'The order was activated' });
  socketIo.emit(broadcast.ACCOUNTS_TAKEN, account_ids);
  const paymentUpdated = await paypalPayment.update({ _id: Payment._id }, { $set: { Active: true } });
  if (!paymentUpdated) rollbar.error(`Could not activate payment with id "${Payment._id}"`);
};
