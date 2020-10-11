require('colors');

require('../../src/utils');
const { updateEnv } = require('./update_env');
const { cloneReaper } = require('./clone_reaper');

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'localhost') {
  console.error('Cannot build on local environment, just run `npm run dev`\n'.red);
  process.exit(1);
}

updateEnv(true).then(() => {
  cloneReaper();
});
