import 'load_env';
import 'globals';
import throng from 'throng';
import env from './env.json';

const start = threadID => {
  process.env.threadID = threadID;
  require('./utils/middlewares');
  require('./routes/schemas');
  require('./database');
  require('./tasks');
  require('./routes/socket.io');
};

if (env.MULTIPLE_THREADS.toLowerCase() === 'true') throng(+env.THREADS, start);
else start(1);

process.on('uncaughtException', (err, origin) => {
  log(origin);
  log(err);
});
