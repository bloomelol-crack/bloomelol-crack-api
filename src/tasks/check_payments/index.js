/* eslint-disable no-await-in-loop */
import { jobInterval } from './constants';
import { assignAccounts } from './assign_accounts';
import { associateHack } from './associate_hack';
import { ORDER_ACTIONS, PAYMENT_PLATFORMS } from '../../constants';

const execute = async () => {
  const next = () => setTimeout(execute, jobInterval);
  const payments = await Payment.get({
    UserID: { $exists: true },
    OrderID: { $exists: true },
    OrderStatus: { $in: ['CREATED', 'SAVED'] }
  });
  if (!payments) {
    logError('Error getting payments for account assign');
    return next();
  }
  if (!payments.length) return next();

  for (let i = 0; i < payments.length; i += 1) {
    const payment = payments[i];
    await (async () => {
      switch (payment.Platform) {
        case PAYMENT_PLATFORMS.PAYPAL: {
          const response = await paypal.getPaymentStatus(payment.OrderID);
          if (!response) return;
          const { status } = response;
          let { body: order } = response;
          if (status === 404) {
            Payment.delete({ _id: payment._id });
            return Account.update({ PaymentID: payment._id }, { $unset: { PaymentID: 1 } });
          }
          if (order.status === 'APPROVED') {
            const orderResponse = await paypal.captureOrder(payment.OrderID);
            if (!orderResponse) return;
            order = orderResponse.body;
          }
          if (order.status !== payment.OrderStatus)
            Payment.update({ _id: payment._id }, { $set: { OrderStatus: order.status } });
          if (order.status !== 'COMPLETED') return;
          break;
        }
        default: {
          return logError(`Invalid Platform for payment ${payment._id}: ${payment.Platform}`);
        }
      }

      // Here the payment is completed
      if (payment.Action === ORDER_ACTIONS.ASSIGN_ACCOUNTS) return assignAccounts(payment);
      if (payment.Action === ORDER_ACTIONS.ASSOCIATE_HACK) return associateHack(payment);
    })();
    await wait(1000);
  }
  next();
};

execute();
