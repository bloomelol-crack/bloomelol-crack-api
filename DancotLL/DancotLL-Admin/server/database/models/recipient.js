const mongoose = require('mongoose');
const leanDefaults = require('mongoose-lean-defaults');

module.exports = mongoose.model(
  'Recipient',
  new mongoose.Schema(
    {
      Email: { type: String, required: true },
      Phone: { type: String, required: true }
    },
    { collection: 'Recipients' }
  ).plugin(leanDefaults)
);
