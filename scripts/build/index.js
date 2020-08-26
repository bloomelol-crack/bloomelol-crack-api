require('colors');

const { updateEnv } = require('./update_env');

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'localhost') {
  console.error('Cannot build on local environment, just run `npm run dev`\n'.red);
  process.exit(1);
}

updateEnv(true);
