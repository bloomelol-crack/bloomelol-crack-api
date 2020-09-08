const { defineGetPacks, broadcastGetPacks } = require('./getPacks');
/**
 * @param {import('socket.io').Socket} socket */
const define = socket => {
  defineGetPacks(socket);
};

module.exports = { define, broadcastGetPacks };