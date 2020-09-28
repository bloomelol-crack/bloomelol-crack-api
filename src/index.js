import 'load_env';
import 'globals';
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
  log(origin);
  log(err);
});
const { wait } = require('./utils/wait');

[
  'SIGHUP',
  'SIGINT',
  'SIGQUIT',
  'SIGILL',
  'SIGTRAP',
  'SIGABRT',
  'SIGBUS',
  'SIGFPE',
  'SIGUSR1',
  'SIGSEGV',
  'SIGUSR2',
  'SIGTERM'
].forEach(sig => {
  process.on(sig, () => {
    console.log('byeeee');
    (async () => {
      await wait(1000);
      console.log('Exiting after 1 sec!');
    })();
  });
});
