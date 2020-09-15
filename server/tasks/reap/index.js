const { run } = require('../../../scripts/utils');

const { getRandomTime } = require('./utils');

const fromTime = 1000 * 60 * 25; // 25 mins
const toTime = 1000 * 60 * 35; // 35 mins

const execute = () => {
  run('npm run reap');
  setTimeout(execute, getRandomTime(fromTime, toTime));
};

setTimeout(execute, getRandomTime(fromTime, toTime));
