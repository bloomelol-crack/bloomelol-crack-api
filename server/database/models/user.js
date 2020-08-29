const mongoose = require('mongoose');
const leanDefaults = require('mongoose-lean-defaults');

module.exports = mongoose.model(
  'User',
  new mongoose.Schema(
    {
      Name: { type: String, required: true },
      Surname: { type: String, required: true },
      Email: { type: String, required: true },
      Password: { type: String, required: true }
    },
    { collection: 'Users' }
  ).plugin(leanDefaults)
);
