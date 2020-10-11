const { emit, receive } = require('./constants');

/**
 * @param {import('socket.io').Socket} socket */
const defineGetLogins = socket => {
  socket.on(receive.GET_LOGINS, async () => {
    const logins = await Login.get({}, { sort: { _id: -1 }, limit: 100 });
    if (!logins) return socket.emit(emit.GET_LOGINS_FAILURE);
    socket.emit(emit.GET_LOGINS_SUCCESS, logins);
  });
};

exports.defineGetLogins = defineGetLogins;
