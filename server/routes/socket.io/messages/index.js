const { defineGetMessages } = require('./getMessages');
const { definePostMessage } = require('./postMessage');
const { defineEmitReceivedMessage } = require('./emitReceivedMessage');

/**
 * @param {import('socket.io').Socket} socket
 */
const define = socket => {
  defineGetMessages(socket);
  definePostMessage(socket);
  defineEmitReceivedMessage(socket);
};

module.exports = { define };
