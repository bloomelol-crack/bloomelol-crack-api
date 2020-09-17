import mongoose from 'mongoose';
import leanDefaults from 'mongoose-lean-defaults';

export const login = mongoose.model(
  'Login',
  new mongoose.Schema(
    {
      UserID: { type: String, required: true },
      UserName: String,
      UserSurname: String,
      IP: { type: String, required: true }
    },
    { collection: 'Logins', timestamps: true }
  ).plugin(leanDefaults)
);
