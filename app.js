const throng = require('throng');

const env = require('./env.json');

const threads = +env.THREADS;

const start = threadID => {
  require('./server/utils/middlewares');
  require('./server/routes/schemas');
  require('./server/database');
  require('./server/tasks');
  require('./server/routes/socket.io');
};

if (env.MULTIPLE_THREADS.toLowerCase() === 'true') throng(threads, start);
else start(1);

process.on('uncaughtException', (err, origin) => {
  console.log(origin);
  console.log(err);
});
