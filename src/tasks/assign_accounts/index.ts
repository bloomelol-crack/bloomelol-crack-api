import db from 'database';
import rollbar from 'utils/rollbar';
const interval = 1000 * 60 * 1;
import { getPaymentStatus, captureOrder } from 'utils/paypal';
import { isArray } from 'utils/types';
import { socketIo } from 'routes/socket.io';
import * as constants from 'tasks/assign_accounts/constants';

const execute = async (): Promise<NodeJS.Timeout | undefined> => {
  const next = () => setTimeout(execute, interval);
  const Payments = await db.paypalPayment?.get({
    UserID: { $exists: true },
    OrderID: { $exists: true },
    OrderStatus: { $in: ['CREATED', 'SAVED'] }
  });
  if (!Payments) {
    rollbar.error('Error getting payments for account assign');
    return next();
  }
  if (!Payments.length) return next();
  Payments.forEach(async Payment => {
    const response = await getPaymentStatus(Payment.OrderID);
    if (typeof response !== 'object' || !response || isArray(response)) return next();
    const { status } = response;
    let { body: order } = response;
    if (status === 404) {
      db.paypalPayment?.delete({ _id: Payment._id });
      db.account?.update({ PaypalPaymentID: Payment._id }, { $unset: { PaypalPaymentID: 1 } });
      return next();
    }

    if (order.status === 'APPROVED') {
      const orderResponse = await captureOrder(Payment.OrderID);
      if (!orderResponse) return next();
      order = orderResponse.body;
    }
    if (order.status !== Payment.OrderStatus)
      db.paypalPayment?.update({ _id: Payment._id }, { $set: { OrderStatus: order.status } });

    if (order.status !== 'COMPLETED') return next();
    const Accounts = await db.account?.get({ PaypalPaymentID: Payment._id });
    if (!Accounts) {
      rollbar.critical(`After Payment: Could not find account with payment ${Payment._id}`);
      return next();
    }
    if (!Accounts.length) {
      rollbar.critical(`After Payment: Didn't find account with payment ${Payment._id}`);
      return next();
    }
    const [Account] = Accounts;
    const accountUpdated = await db.account?.update(
      { PaypalPaymentID: Payment._id },
      { UserID: Payment.UserID }
    );
    if (!accountUpdated) {
      rollbar.critical(`After Payment: Could not update account with payment ${Payment._id}`);
      return next();
    }
    rollbar.info(
      `Purchased account with Payment ${Payment._id} ($${Payment.Amount} USD), updated ${accountUpdated}`
    );
    next();

    return void socketIo.emit(constants.emit.ACCOUNT_PURCHASED, Account);
  });
};

execute();
