const { socketIo } = require('../../utils/middlewares');

const account = require('./account');

socketIo.sockets.on('connect', socket => {
  console.log('Client connected');
  account.define(socket);
});

module.exports = { socketIo };
