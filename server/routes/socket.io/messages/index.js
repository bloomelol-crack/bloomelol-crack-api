const { defineGetMessages } = require('./getMessages');
const { definePostMessage } = require('./postMessage');

/**
 * @param {import('socket.io').Socket} socket
 */
const define = socket => {
  defineGetMessages(socket);
  definePostMessage(socket);
};

module.exports = { define };
