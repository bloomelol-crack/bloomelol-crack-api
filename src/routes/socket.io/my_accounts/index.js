const constants = require('./constants');
/**
 * @param {import('socket.io').Socket} socket
 */
const define = socket => {
  socket.on(constants.receive.GET_MY_ACCOUNTS, async userId => {
    if (!userId) return socket.emit(constants.emit.GET_MY_ACCOUNTS_FAILURE);
    const accounts = await Account.get({ UserID: userId }, { sort: { Level: -1 } });
    if (!accounts) return socket.emit(constants.emit.GET_MY_ACCOUNTS_FAILURE);
    socket.emit(constants.emit.GET_MY_ACCOUNTS_SUCCESS, accounts);
  });
};

module.exports = { define };
