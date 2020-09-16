const mongoose = require('mongoose');
const leanDefaults = require('mongoose-lean-defaults');

module.exports = mongoose.model(
  'Log',
  new mongoose.Schema(
    {
      IP: String,
      Data: { type: mongoose.SchemaTypes.Mixed, required: true }
    },
    { collection: 'Logs', timestamps: true }
  ).plugin(leanDefaults)
);
