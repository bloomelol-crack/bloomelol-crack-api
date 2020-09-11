const { message } = require('../../../database/models');

const { emit, receive } = require('./constants');

/**
 * @param {import('socket.io').Socket} socket */
const defineGetMessages = socket => {
  socket.on(receive.GET_MESSAGES, async (skip, count) => {
    if (!count) return socket.emit(emit.GET_MESSAGES_FAILURE);
    const Messages = await message.get({}, { sort: { _id: -1 }, skip, limit: count });
    if (!Messages) return socket.emit(emit.GET_MY_ACCOUNTS_FAILURE);
    socket.emit(emit.GET_MESSAGES_SUCCESS, Messages);
  });
};

exports.defineGetMessages = defineGetMessages;
