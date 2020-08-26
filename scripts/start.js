const { updateEnv } = require('./build/update_env');
const { run } = require('./utils');

(async () => {
  await updateEnv();
  run('node --max-old-space-size=4096 app');
})();
