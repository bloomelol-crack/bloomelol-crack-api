const { login } = require('../../../database/models');

const { emit, receive } = require('./constants');

/**
 * @param {import('socket.io').Socket} socket */
const defineGetLogins = socket => {
  socket.on(receive.GET_LOGINS, async () => {
    const Logins = await login.get({}, { sort: { _id: -1 }, limit: 100 });
    if (!Logins) return socket.emit(emit.GET_LOGINS_FAILURE);
    socket.emit(emit.GET_LOGINS_SUCCESS, Logins);
  });
};

exports.defineGetLogins = defineGetLogins;
