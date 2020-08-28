const fs = require('fs');

require('colors');
const projectDir = require('../../src/utils/projectDir');

const envPath = `${projectDir}/env.json`;

const updateEnv = mustHaveFileKeys =>
  new Promise(resolve => {
    const env = JSON.stringify(process.env);
    fs.readFile(envPath, 'utf8', (error, data) => {
      if (error) console.error(error);
      const localEnv = JSON.parse(data);
      Object.keys(localEnv).forEach(key => {
        if (mustHaveFileKeys && process.env[key] === undefined) {
          console.error(`Missing key in process.env: "${key}"\n`.red);
          process.exit(1);
        }
      });
      fs.writeFile(envPath, env, writeError => {
        if (writeError) console.error(writeError);
        resolve(true);
      });
    });
  });

module.exports = { updateEnv };
