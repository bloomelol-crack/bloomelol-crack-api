const mongoose = require('mongoose');
const leanDefaults = require('mongoose-lean-defaults');

module.exports = mongoose.model(
  'Product',
  new mongoose.Schema(
    {
      Name: { type: String, required: true },
      Description: String,
      CurrencyID: { type: String, default: 'ARS' },
      Price: { type: Number, required: true }
    },
    { collection: 'Products' }
  ).plugin(leanDefaults)
);
