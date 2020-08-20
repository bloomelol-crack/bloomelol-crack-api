const { socketIo } = require('../../commons/middlewares');

const account = require('./account');

socketIo.sockets.on('connect', socket => {
  console.log('Client connected');
  account.define(socket);
});
