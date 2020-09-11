const mongoose = require('mongoose');
const leanDefaults = require('mongoose-lean-defaults');

module.exports = mongoose.model(
  'Message',
  new mongoose.Schema(
    {
      UserID: { type: String, required: true },
      UserName: String,
      UserSurname: String,
      Text: { type: String, required: true },
      Status: {
        type: String,
        required: true,
        enum: ['Sent', 'Received']
      }
    },
    { collection: 'Messages', timestamps: true }
  ).plugin(leanDefaults)
);
