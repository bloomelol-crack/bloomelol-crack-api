import { getOrder } from 'utils/paypal';
import { getAccountPrice } from 'utils/account';
import rollbar from 'utils/rollbar';
import db from 'database/index';
import { socketIo } from 'routes/socket.io';
import { broadcast } from 'routes/socket.io/all_accounts/constants';

module.exports = {
  getOrder: async (req: ExpressRequest, res: ExpressResponse): Promise<any> => {
    const account_id = <string>req.query.account_id;
    const { _id: user_id } = req.session?.user;

    const Accounts = await db.account?.get({ _id: account_id });
    if (!Accounts) return res.status(500).json({ error: 'Error searching Account' });
    if (!Accounts.length) return res.status(404).json({ error: 'Account not found' });
    const [Account] = Accounts;
    const price = getAccountPrice(Account);
    if (price <= 0) return res.status(500).json({ error: 'There was a problem with price calculation' });
    const { link, order } = await getOrder(user_id, price, 'USD');
    if (!link || !order) return res.status(500).json({ error: 'Could not get a payment link' });
    res.status(200).json({ payment_link: link, order_id: order.id });
  },
  activatePayment: async (req: ExpressRequest, res: ExpressResponse): Promise<any> => {
    const { order_id, account_id } = req.body;
    const Payments = await db.paypalPayment?.get({ OrderID: order_id });

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
    const paymentUpdated = await db.paypalPayment?.update({ _id: Payment._id }, { $set: { Active: true } });
    if (!paymentUpdated) rollbar.error(`Could not activate payment with id "${Payment._id}"`);
  }
};
