import mongoose from 'mongoose';
import leanDefaults from 'mongoose-lean-defaults';

export interface AccountDoc {
  _id?: string;
  UserName: string;
  Password: string;
  NewPassword?: string;
  Level?: number;
  FromUrl?: string;
  Email?: string;
  NewEmail?: string;
  MachineIndex?: number;
  Sold?: boolean;
  Price?: number;
  UserID?: string;
  PaypalPaymentID?: string;
}

export default mongoose.model(
  'Account',
  new mongoose.Schema(
    {
      UserName: { type: String, required: true },
      Password: { type: String, required: true },
      NewPassword: String,
      Level: Number,
      FromUrl: String,
      Email: String,
      NewEmail: String,
      MachineIndex: Number,
      Sold: { type: Boolean, default: false },
      Price: Number,
      UserID: String,
      PaypalPaymentID: String
    },
    { collection: 'Accounts' }
  ).plugin(leanDefaults)
);
