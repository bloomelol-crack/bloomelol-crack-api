import 'load_env';
import log from 'debug';

globalThis.log = log('app');
globalThis.logError = (...args) => {
  rollbar.error(...args);
  log('app:error')(...args);
};
