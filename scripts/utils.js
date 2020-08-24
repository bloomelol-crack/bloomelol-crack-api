/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
const fs = require('fs');
const { exec } = require('child_process');
require('colors');

const execOne = (command, wait) =>
  new Promise(resolve => {
    if (wait) {
      console.log(`--> ${command}`);
    }
    exec(command, (error, stdout, stderr) => {
      if (!wait) {
        console.log(`--> ${command}`);
      }
      let output = '';
      if (error) {
        output = `--- error: ${error.message}`.red;
        console.log(output);
        return resolve(false);
      }
      if (stderr) {
        console.log(`--- stderr: ${stderr}`.yellow);
      }
      console.log(`--- ${stdout}`.green);
      resolve(true);
    });
  });

module.exports.run = async commands => {
  // Parallel commands
  if (!Array.isArray(commands)) commands = [commands];
  const promises = [];
  for (let k = 0; k < commands.length; k += 1) promises.push(execOne(commands[k], false));

  return Promise.all(promises);
};

module.exports.runWait = async commands => {
  // Sequential commands
  if (!Array.isArray(commands)) commands = [commands];
  const results = [];
  for (let k = 0; k < commands.length; k += 1) results.push(await execOne(commands[k], true));
  return results;
};

module.exports.runInterval = async (commands, interval) =>
  new Promise(resolve => {
    // Sequential commands
    if (!Array.isArray(commands)) commands = [commands];

    let count = 0;
    for (let k = 0; k < commands.length; k += 1) {
      setTimeout(async () => {
        execOne(commands[k], true);
        count += 1;
        if (count === commands.length) {
          resolve(true);
        }
      }, k * interval);
    }
  });

module.exports.getOptions = () => {
  const params = process.argv.slice(2);
  const obj = { params: [] };
  let currKey = '';
  for (let k = 0; k < params.length; k += 1) {
    if (params[k].startsWith(':::')) {
      currKey = params[k].substring(3);
      obj[currKey] = [];
    } else if (params[k].startsWith('::')) {
      if (params[k + 1] && !params[k + 1].startsWith('::')) {
        obj[params[k].substring(2)] = params[k + 1];
        k += 1;
      } else {
        obj[params[k].substring(2)] = true;
      }
    } else if (currKey) {
      obj[currKey].push(params[k]);
    } else {
      obj.params.push(params[k]);
    }
  }
  return obj;
};
