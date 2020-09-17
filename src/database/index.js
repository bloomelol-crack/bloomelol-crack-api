import mongoose, { connect } from 'mongoose';

import { MONGODB_URL } from '../../env.json';

mongoose.set('useCreateIndex', true);
connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, async error => {
  if (error) return console.error(error);
  console.log('Connected to MongoDB!');
});
