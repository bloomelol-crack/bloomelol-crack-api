import log from 'debug';

globalThis.log = log('app');
globalThis.logError = log('app:error');
