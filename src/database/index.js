import mongoose from 'mongoose';

import { MONGODB_URL } from 'env.json';

mongoose.set('useCreateIndex', true);
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, async error => {
  if (error) return logError(error);
  log('Connected to MongoDB!');
});
