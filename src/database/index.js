import mongoose from 'mongoose';

import './models';
import { MONGODB_URL } from '../env.json';

console.log('connecting to mongo', MONGODB_URL);
log('connecting to mongo');
mongoose.set('useCreateIndex', true);
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, async error => {
  if (error) return logError(error);
  log('Connected to MongoDB!');
});
