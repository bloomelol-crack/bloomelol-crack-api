import mongoose from 'mongoose';
import leanDefaults from 'mongoose-lean-defaults';

export const payment = mongoose.model(
  'Payment',
  new mongoose.Schema(
    {
      UserID: { type: String, required: true },
      OrderID: { type: String, required: true },
      Platform: { type: String, required: true }, // mercadopago | paypal
      Action: { type: String, required: true }, // assign_accounts | associate_hack
      OrderStatus: { type: String, required: true },
      Amount: { type: Number, required: true },
      Currency: { type: String, required: true },
      Link: { type: String, required: true },
      Active: { type: Boolean, required: true }
    },
    { collection: 'Payments' }
  ).plugin(leanDefaults)
);
