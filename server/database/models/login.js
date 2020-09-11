const mongoose = require('mongoose');
const leanDefaults = require('mongoose-lean-defaults');

module.exports = mongoose.model(
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
