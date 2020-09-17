import throng from 'throng';
import env from './env.json';

const threads = +env.THREADS;

const start = () => {
  require('./utils/middlewares');
  require('./routes/schemas');
  require('./database');
  require('./tasks');
  require('./routes/socket.io');
};

if (env.MULTIPLE_THREADS.toLowerCase() === 'true') throng(threads, start);
else start(1);

process.on('uncaughtException', (err, origin) => {
  console.log(origin);
  console.log(err);
});
