const { updateEnv } = require('./build');
const { update } = require('./build');
const { run } = require('./utils');

async () => {
  await updateEnv();
  run('node --max-old-space-size=4096 app');
};
