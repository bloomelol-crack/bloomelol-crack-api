const mongoose = require('mongoose');
const leanDefaults = require('mongoose-lean-defaults');

module.exports = mongoose.model(
  'PaypalPayment',
  new mongoose.Schema(
    {
      OrderID: { type: String, required: true },
      OrderStatus: { type: String, required: true },
      Amount: { type: Number, required: true },
      Currency: { type: String, required: true },
      Link: { type: String, required: true }
    },
    { collection: 'PaypalPayments' }
  ).plugin(leanDefaults)
);
