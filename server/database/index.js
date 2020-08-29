const mongoose = require('mongoose');

const { MONGODB_URL } = require('../../env.json');

const { connect } = mongoose;

mongoose.set('useCreateIndex', true);
connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, async error => {
  if (error) return console.error(error);
  console.log('Connected to MongoDB!');
});
