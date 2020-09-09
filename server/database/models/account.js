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
      Elo: String,
      LastPlay: Date,
      MachineIndex: Number,
      Price: Number,
      UserID: String,
      PaypalPaymentID: String,
      NotInRegions: [String]
    },
    { collection: 'Accounts', timestamps: true }
  ).plugin(leanDefaults)
);
