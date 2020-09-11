const { defineGetLogins } = require('./getLogins');

/**
 * @param {import('socket.io').Socket} socket
 */
const define = socket => {
  defineGetLogins(socket);
};

module.exports = { define };
