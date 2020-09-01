const mongoose = require('mongoose');
const leanDefaults = require('mongoose-lean-defaults');

const { LANGUAGES } = require('../../routes/schemas/user/constants');

module.exports = mongoose.model(
  'User',
  new mongoose.Schema(
    {
      Name: { type: String, required: true },
      Surname: { type: String, required: true },
      Email: { type: String, required: true },
      Password: { type: String, required: true },
      Language: { type: String, default: LANGUAGES.EN }
    },
    { collection: 'Users' }
  ).plugin(leanDefaults)
);
