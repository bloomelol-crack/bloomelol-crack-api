const { run } = require('../../../scripts/utils');

const { getRandomTime } = require('./utils');

const fromTime = 1000 * 60 * 30; // 30 mins
const toTime = 1000 * 60 * 40; // 40 mins

const execute = () => {
  run('npm run reap');
  setTimeout(execute, getRandomTime(fromTime, toTime));
};

setTimeout(execute, getRandomTime(fromTime, toTime));
