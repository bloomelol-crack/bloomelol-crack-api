import mongoose from 'mongoose';
import leanDefaults from 'mongoose-lean-defaults';

export const paypalPayment = mongoose.model(
  'PaypalPayment',
  new mongoose.Schema(
    {
      UserID: { type: String, required: true },
      OrderID: { type: String, required: true },
      OrderStatus: { type: String, required: true },
      Amount: { type: Number, required: true },
      Currency: { type: String, required: true },
      Link: { type: String, required: true },
      Active: { type: Boolean, required: true }
    },
    { collection: 'PaypalPayments' }
  ).plugin(leanDefaults)
);