import { broadcast } from 'routes/socket.io/all_accounts/constants';
import { broadcastGetPacks } from 'routes/socket.io/packs';
import { ORDER_TYPES } from '../../../constants';

export const activate = async (req, res) => {
  const { order_id: bodyOrderID } = req.body;
  const { order_id, order_type } = req.session;
  const { user_id } = req.session;

  if (!user_id) return res.status(403).json({ error: 'Not logged in' });
  if (!order_id) return res.status(400).json({ error: 'order_id not in session' });
  if (order_id !== bodyOrderID) return res.status(400).json({ error: 'order_id mismatch' });
  if (!order_type) return res.status(400).json({ error: 'order_type not in session' });

  const payments = await Payment.get({ OrderID: order_id });
  if (!payments) return res.status(500).json({ error: 'Error searching Payment' });
  if (!payments.length) return res.status(404).json({ error: 'Payment not found' });
  const [payment] = payments;
  if (payment.Active) return res.status(409).json({ message: 'Order was already activated' });

  switch (order_type) {
    case ORDER_TYPES.ACCOUNT:
    case ORDER_TYPES.PACK: {
      const { account_ids } = req.session;
      if (!account_ids) return res.status(400).json({ error: 'account_ids not in session' });
      const accountUpdated = await Account.update(
        { _id: { $in: account_ids }, PaymentID: { $exists: false }, UserID: { $exists: false } },
        { $set: { PaymentID: payment._id } }
      );
      if (accountUpdated !== account_ids.length) {
        res.status(422).json({ error: 'Not all accounts where updated' });

        return Account.update({ _id: { $in: account_ids } }, { $unset: { PaymentID: 1 } });
      }
      socketIo.emit(broadcast.ACCOUNTS_TAKEN, account_ids);
      broadcastGetPacks();
      break;
    }
    case ORDER_TYPES.HACK: {
      const { hack } = req.session;
      if (!hack) return res.status(400).json({ error: 'hack not in session' });
      const userUdpated = await User.updateOrPush(
        { _id: user_id },
        { 'Hacks.Code': hack.Code },
        { 'Hacks.$': hack }
      );
      if (!userUdpated)
        logError(`Could not update user ${user_id} setting hack:\n${JSON.stringify(hack, null, 2)}`);
      break;
    }
    default: {
      const error = `Invalid order type: ${order_type}`;
      logError(error);
      return res.status(400).json({ error });
    }
  }
  res.status(200).json({ message: 'The order was activated' });
  const paymentUpdated = await Payment.update({ _id: payment._id }, { $set: { Active: true } });
  if (!paymentUpdated) logError(`Could not activate payment with id "${payment._id}"`);
};
