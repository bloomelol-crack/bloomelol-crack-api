import mongoose, { connect } from 'mongoose';
import db from 'database/models';

import env from 'env/';

mongoose.set('useCreateIndex', true);
connect(env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, async (error: Error) => {
  if (error) return console.error(error);
  console.log('Connected to MongoDB!');
});

export default db;
