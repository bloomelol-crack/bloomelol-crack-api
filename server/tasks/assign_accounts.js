const interval = 1000 * 60 * 1;
const { account, paypalPayment } = require('../database/models');
const rollbar = require('../utils/rollbar');
const { getOrder, getPaymentStatus, captureOrder } = require('../utils/paypal');

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
  Payments.forEach(async Payment => {
    const response = await getPaymentStatus(Payment.OrderID);
    if (!response) return next();
    const { status } = response;
    let { body: order } = response;
    if (status === 404) {
      paypalPayment.delete({ _id: Payment._id });
      account.update({ PaypalPaymentID: Payment._id }, { $unset: { PaypalPaymentID: 1 } });
      return next();
    }

    if (order.status === 'APPROVED') {
      const orderResponse = await captureOrder(Payment.OrderID);
      if (!orderResponse) return next();
      order = orderResponse.body;
    }
    if (order.status !== Payment.OrderStatus)
      paypalPayment.update({ _id: Payment._id }, { $set: { OrderStatus: order.status } });

    if (order.status !== 'COMPLETED') return next();
    const accountUpdated = await account.update({ PaypalPaymentID: Payment._id }, { UserID: Payment.UserID });
    if (!accountUpdated) {
      rollbar.critical(`After Payment: Could not update account with payment ${Payment._id}`);
      return next();
    }
    rollbar.info(
      `Purchased account with Payment ${Payment._id} ($${Payment.Amount} USD), updated ${accountUpdated}`
    );
    next();
  });
};

execute();
