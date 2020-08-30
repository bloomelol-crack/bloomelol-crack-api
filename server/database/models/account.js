const mongoose = require('mongoose');
const leanDefaults = require('mongoose-lean-defaults');

module.exports = mongoose.model(
  'Account',
  new mongoose.Schema(
    {
      UserName: { type: String, required: true },
      Password: { type: String, required: true },
      NewPassword: String,
      FromUrl: String,
      Email: String,
      EmailVerified: Boolean,
      NewEmail: String,
      Region: String,
      BlueEssence: Number,
      Level: Number,
      RP: Number,
      Refunds: Number,
      Champs: Number,
      Skins: Number,
      LastPlay: Date,
      MachineIndex: Number,
      Sold: { type: Boolean, default: false },
      Price: Number,
      UserID: String,
      PaypalPaymentID: String
    },
    { collection: 'Accounts' }
  ).plugin(leanDefaults)
);
