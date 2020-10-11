const { emit, receive } = require('./constants');

/**
 * @param {import('socket.io').Socket} socket */
const defineGetMessages = socket => {
  socket.on(receive.GET_MESSAGES, async ({ skip, count }) => {
    if (!count) return socket.emit(emit.GET_MESSAGES_FAILURE);
    const messages = await Message.get({}, { sort: { _id: -1 }, skip, limit: count });
    if (!messages) return socket.emit(emit.GET_MY_ACCOUNTS_FAILURE);
    socket.emit(emit.GET_MESSAGES_SUCCESS, messages.reverse());
  });
};

exports.defineGetMessages = defineGetMessages;
