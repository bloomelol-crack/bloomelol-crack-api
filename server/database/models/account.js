require('../../commons/env');
const mongoose = require('mongoose');
const leanDefaults = require('mongoose-lean-defaults');

module.exports = mongoose.model(
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
      Price: Number
    },
    { collection: 'Accounts' }
  ).plugin(leanDefaults)
);
