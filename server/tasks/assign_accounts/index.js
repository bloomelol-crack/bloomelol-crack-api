/* eslint-disable no-await-in-loop */
const interval = 1000 * 60 * 1;

const { account, paypalPayment } = require('../../database/models');
const rollbar = require('../../utils/rollbar');
const { wait } = require('../../utils/wait');
const { getPaymentStatus, captureOrder } = require('../../utils/paypal');
const { socketIo } = require('../../routes/socket.io');

const { emit } = require('./constants');

const execute = async () => {
  const next = () => setTimeout(execute, interval);
  const Payments = await paypalPayment.get({
    UserID: { $exists: true },
    OrderID: { $exists: true },
    OrderStatus: { $in: ['CREATED', 'SAVED'] }
  });
  if (!Payments) {
    rollbar.error('Error getting payments for account assign');
    return next();
  }
  if (!Payments.length) return next();
  for (let i = 0; i < Payments.length; i += 1) {
    const Payment = Payments[i];
    await (async () => {
      const response = await getPaymentStatus(Payment.OrderID);
      if (!response) return;
      const { status } = response;
      let { body: order } = response;
      if (status === 404) {
        paypalPayment.delete({ _id: Payment._id });
        account.update({ PaypalPaymentID: Payment._id }, { $unset: { PaypalPaymentID: 1 } });
        return;
      }

      if (order.status === 'APPROVED') {
        const orderResponse = await captureOrder(Payment.OrderID);
        if (!orderResponse) return;
        order = orderResponse.body;
      }
      if (order.status !== Payment.OrderStatus)
        paypalPayment.update({ _id: Payment._id }, { $set: { OrderStatus: order.status } });

      if (order.status !== 'COMPLETED') return;
      const Accounts = await account.get({ PaypalPaymentID: Payment._id });
      if (!Accounts) {
        rollbar.critical(`After Payment: Could not find account with payment ${Payment._id}`);
        return;
      }
      if (!Accounts.length) {
        rollbar.critical(`After Payment: Didn't find account with payment ${Payment._id}`);
        return;
      }
      const [Account] = Accounts;
      const accountUpdated = await account.update(
        { PaypalPaymentID: Payment._id },
        { UserID: Payment.UserID }
      );
      if (!accountUpdated) {
        rollbar.critical(`After Payment: Could not update account with payment ${Payment._id}`);
        return;
      }
      rollbar.info(
        `Purchased account with Payment ${Payment._id} ($${Payment.Amount} USD), updated ${accountUpdated}`
      );

      socketIo.emit(emit.ACCOUNT_PURCHASED, Account);
    })();
    await wait(1000);
  }
  next();
};

execute();
